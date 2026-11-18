import { FilterQuery, Types } from "mongoose";
import { VacationModel, IVacationModel } from "../models/vacation-model";
import { UserModel } from "../models/user-model";
import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enums";
import { saver } from "../utils/image-saver";

export type VacationFilter = "all" | "liked" | "active" | "notStarted";

class VacationService {

    private readonly pageSize = 9;

    // A malformed id can never exist in the database, so it is reported as "not found" (404)
    // instead of letting Mongoose fail with a casting error (500):
    private assertValidId(_id: string): void {
        if (!Types.ObjectId.isValid(_id)) {
            throw new ClientError(StatusCode.NotFound, `Vacation with _id ${_id} not found.`);
        }
    }

    // The likes are stored inside the users ("likedVacations" array), so the likes of a vacation are
    // counted by one aggregation: open every user's array, keep only the requested vacations and group by vacation.
    // Returns a map of: vacation id -> number of users who liked it.
    private async getLikesCountMap(vacationIds: Types.ObjectId[]): Promise<Map<string, number>> {
        const rows = await UserModel.aggregate<{ _id: Types.ObjectId; likes: number }>([
            { $match: { likedVacations: { $in: vacationIds } } },
            { $unwind: "$likedVacations" },
            { $match: { likedVacations: { $in: vacationIds } } },
            { $group: { _id: "$likedVacations", likes: { $sum: 1 } } }
        ]).exec();
        return new Map(rows.map(row => [row._id.toString(), row.likes]));
    }

    // The ids of the vacations the given user liked (empty for a guest):
    private async getLikedVacationIds(userId?: string): Promise<Types.ObjectId[]> {
        if (!userId) return [];
        const user = await UserModel.findById(userId).exec();
        return user?.likedVacations ?? [];
    }

    // Attach "likesCount" and "likedByMe" to every given vacation, using one query for all of them:
    private async withLikeInfo(vacations: IVacationModel[], userId?: string) {
        const vacationIds = vacations.map(vacation => vacation._id);
        const likesCountMap = await this.getLikesCountMap(vacationIds);
        const likedIds = (await this.getLikedVacationIds(userId)).map(id => id.toString());

        return vacations.map(vacation => ({
            ...vacation.toJSON(),
            likesCount: likesCountMap.get(vacation._id.toString()) ?? 0,
            likedByMe: likedIds.includes(vacation._id.toString())
        }));
    }

    public async getVacations(filter: VacationFilter, page: number, userId?: string) {

        const now = new Date();
        let query: FilterQuery<IVacationModel> = {};

        if (filter === "active") {
            // Already started and not yet finished:
            query = { startDate: { $lte: now }, endDate: { $gte: now } };
        }
        else if (filter === "notStarted") {
            query = { startDate: { $gt: now } };
        }
        else if (filter === "liked") {
            if (!userId) throw new ClientError(StatusCode.Unauthorized, "You must be logged in to filter liked vacations.");
            query = { _id: { $in: await this.getLikedVacationIds(userId) } };
        }

        const skip = (page - 1) * this.pageSize;
        const totalCount = await VacationModel.countDocuments(query).exec();

        // Vacations are always shown in ascending order of their start date:
        const vacations = await VacationModel
            .find(query)
            .sort({ startDate: 1 })
            .skip(skip)
            .limit(this.pageSize)
            .exec();

        return {
            vacations: await this.withLikeInfo(vacations, userId),
            totalCount,
            totalPages: Math.ceil(totalCount / this.pageSize),
            currentPage: page
        };
    }

    public async getOneVacation(_id: string, userId?: string) {
        this.assertValidId(_id);
        const dbVacation = await VacationModel.findById(_id).exec();
        if (!dbVacation) {
            throw new ClientError(StatusCode.NotFound, `Vacation with _id ${_id} not found.`);
        }
        const [vacationWithLikes] = await this.withLikeInfo([dbVacation], userId);
        return vacationWithLikes;
    }

    public async addVacation(vacation: IVacationModel): Promise<IVacationModel> {

        // Business rules that live in the model: an image is required and the start date cannot be in the past:
        vacation.validateBeforeAdd();

        // Validate before saving the image, so an invalid vacation never leaves an orphan image on disk.
        // The image name does not exist yet - it is created (as a UUID) when the image is saved below:
        await ClientError.validate(vacation, ["imageName"]);

        vacation.imageName = (await saver.save(vacation.image!))!;
        vacation.image = undefined;

        return vacation.save();
    }

    public async updateVacation(vacation: IVacationModel): Promise<IVacationModel> {

        // A malformed id cannot be cast to an ObjectId, so it is checked as plain text first:
        this.assertValidId(String(vacation._id));
        const existingVacation = await VacationModel.findById(vacation._id).exec();
        if (!existingVacation) {
            throw new ClientError(StatusCode.NotFound, `Vacation with _id ${vacation._id} not found.`);
        }

        // Merge onto the existing document and validate manually - never pass
        // runValidators to findByIdAndUpdate, since the "endDate after startDate"
        // cross-field validator needs "this" to be the full Document, not a Query:
        existingVacation.destination = vacation.destination;
        existingVacation.description = vacation.description;
        existingVacation.startDate = vacation.startDate;
        existingVacation.endDate = vacation.endDate;
        existingVacation.price = vacation.price;

        await ClientError.validate(existingVacation);

        // Only after the data is valid: if a new image was uploaded, replace the old one on disk:
        if (vacation.image) {
            existingVacation.imageName = (await saver.update(vacation.image, existingVacation.imageName))!;
        }

        return existingVacation.save();
    }

    public async deleteVacation(_id: string): Promise<void> {
        this.assertValidId(_id);
        const dbVacation = await VacationModel.findById(_id).exec();
        if (!dbVacation) {
            throw new ClientError(StatusCode.NotFound, `Vacation with _id ${_id} not found.`);
        }
        await saver.delete(dbVacation.imageName);
        await VacationModel.findByIdAndDelete(_id).exec();

        // Remove the deleted vacation from every user's liked vacations:
        await UserModel.updateMany({ likedVacations: dbVacation._id }, { $pull: { likedVacations: dbVacation._id } }).exec();
    }

    // Used by the report page and the CSV export:
    public async getLikesReport(): Promise<{ destination: string; likes: number }[]> {
        const vacations = await VacationModel.find().exec();
        const likesCountMap = await this.getLikesCountMap(vacations.map(vacation => vacation._id));
        return vacations.map(vacation => ({
            destination: vacation.destination,
            likes: likesCountMap.get(vacation._id.toString()) ?? 0
        }));
    }

}

export const vacationService = new VacationService();
