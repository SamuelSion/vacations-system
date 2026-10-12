import { Types } from "mongoose";
import { VacationModel, IVacationModel } from "../models/vacation-model";
import { LikeModel } from "../models/like-model";
import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enums";
import { saver } from "../utils/image-saver";

export type VacationFilter = "all" | "liked" | "active" | "notStarted";

class VacationService {

    // Attach "likesCount" and "likedByMe" to a plain vacation object:
    private async withLikeInfo(vacation: IVacationModel, userId?: string) {
        const vacationObject = vacation.toJSON();
        const likesCount = await LikeModel.countDocuments({ vacationId: vacation._id }).exec();
        let likedByMe = false;
        if (userId) {
            const myLike = await LikeModel.findOne({ vacationId: vacation._id, userId }).exec();
            likedByMe = !!myLike;
        }
        return { ...vacationObject, likesCount, likedByMe };
    }

    public async getVacations(filter: VacationFilter, page: number, userId?: string) {

        const now = new Date();
        let query: any = {};

        if (filter === "active") {
            query = { startDate: { $lte: now }, endDate: { $gte: now } };
        }
        else if (filter === "notStarted") {
            query = { startDate: { $gt: now } };
        }

        let vacationIds: Types.ObjectId[] | undefined;

        if (filter === "liked") {
            if (!userId) throw new ClientError(StatusCode.Unauthorized, "You must be logged in to filter liked vacations.");
            const myLikes = await LikeModel.find({ userId }).exec();
            vacationIds = myLikes.map(like => like.vacationId);
            query = { _id: { $in: vacationIds } };
        }

        const pageSize = 9;
        const skip = (page - 1) * pageSize;

        const totalCount = await VacationModel.countDocuments(query).exec();

        const vacations = await VacationModel
            .find(query)
            .sort({ startDate: 1 })
            .skip(skip)
            .limit(pageSize)
            .exec();

        const vacationsWithLikes = await Promise.all(
            vacations.map(vacation => this.withLikeInfo(vacation, userId))
        );

        return {
            vacations: vacationsWithLikes,
            totalCount,
            totalPages: Math.ceil(totalCount / pageSize),
            currentPage: page
        };
    }

    public async getOneVacation(_id: string, userId?: string) {
        const dbVacation = await VacationModel.findById(_id).exec();
        if (!dbVacation) {
            throw new ClientError(StatusCode.NotFound, `Vacation with _id ${_id} not found.`);
        }
        return this.withLikeInfo(dbVacation, userId);
    }

    public async addVacation(vacation: IVacationModel): Promise<IVacationModel> {

        if (!vacation.image) {
            throw new ClientError(StatusCode.BadRequest, "Vacation image is required.");
        }

        const startDate = new Date(vacation.startDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (startDate < today) {
            throw new ClientError(StatusCode.UnprocessableContent, "Start date cannot be in the past.");
        }

        const imageName = await saver.save(vacation.image);
        vacation.imageName = imageName!;
        vacation.image = undefined;

        await ClientError.validate(vacation);

        const dbVacation = await vacation.save();
        return dbVacation;
    }

    public async updateVacation(vacation: IVacationModel): Promise<IVacationModel> {

        const existingVacation = await VacationModel.findById(vacation._id).exec();
        if (!existingVacation) {
            throw new ClientError(StatusCode.NotFound, `Vacation with _id ${vacation._id} not found.`);
        }

        // If a new image was uploaded, replace the old one on disk:
        if (vacation.image) {
            const newImageName = await saver.update(vacation.image, existingVacation.imageName);
            vacation.imageName = newImageName!;
        }
        else {
            vacation.imageName = existingVacation.imageName;
        }
        vacation.image = undefined;

        // Merge onto the existing document and validate manually - never pass
        // runValidators to findByIdAndUpdate, since the "endDate after startDate"
        // cross-field validator needs "this" to be the full Document, not a Query:
        existingVacation.destination = vacation.destination;
        existingVacation.description = vacation.description;
        existingVacation.startDate = vacation.startDate;
        existingVacation.endDate = vacation.endDate;
        existingVacation.price = vacation.price;
        existingVacation.imageName = vacation.imageName;

        await ClientError.validate(existingVacation);

        const dbVacation = await existingVacation.save();
        return dbVacation;
    }

    public async deleteVacation(_id: string): Promise<void> {
        const dbVacation = await VacationModel.findById(_id).exec();
        if (!dbVacation) {
            throw new ClientError(StatusCode.NotFound, `Vacation with _id ${_id} not found.`);
        }
        await saver.delete(dbVacation.imageName);
        await VacationModel.findByIdAndDelete(_id).exec();
        await LikeModel.deleteMany({ vacationId: _id }).exec();
    }

    // Used by the report page and the CSV export:
    public async getLikesReport(): Promise<{ destination: string; likes: number }[]> {
        const vacations = await VacationModel.find().exec();
        const report = await Promise.all(vacations.map(async vacation => {
            const likes = await LikeModel.countDocuments({ vacationId: vacation._id }).exec();
            return { destination: vacation.destination, likes };
        }));
        return report;
    }

}

export const vacationService = new VacationService();
