import { Types } from "mongoose";
import { UserModel } from "../models/user-model";
import { VacationModel } from "../models/vacation-model";
import { ClientError } from "../models/client-error";
import { StatusCode, Role } from "../models/enums";

class LikeService {

    private async assertNotAdmin(userId: string): Promise<void> {
        const user = await UserModel.findById(userId).exec();
        if (user?.roleId === Role.Admin) {
            throw new ClientError(StatusCode.Forbidden, "Admin users cannot like vacations.");
        }
    }

    // A malformed id or an id of a vacation that does not exist cannot be liked:
    private async assertVacationExists(vacationId: string): Promise<void> {
        const exists = Types.ObjectId.isValid(vacationId) && await VacationModel.exists({ _id: vacationId }).exec();
        if (!exists) {
            throw new ClientError(StatusCode.NotFound, `Vacation with _id ${vacationId} not found.`);
        }
    }

    public async addLike(userId: string, vacationId: string): Promise<void> {
        await this.assertNotAdmin(userId);
        await this.assertVacationExists(vacationId);

        // $addToSet adds the id only if it is not already in the array - a user can like a vacation only once:
        await UserModel.updateOne({ _id: userId }, { $addToSet: { likedVacations: vacationId } }).exec();
    }

    public async removeLike(userId: string, vacationId: string): Promise<void> {
        await this.assertVacationExists(vacationId);
        await UserModel.updateOne({ _id: userId }, { $pull: { likedVacations: vacationId } }).exec();
    }

}

export const likeService = new LikeService();
