import { LikeModel } from "../models/like-model";
import { UserModel } from "../models/user-model";
import { ClientError } from "../models/client-error";
import { StatusCode, Role } from "../models/enums";

class LikeService {

    private async assertNotAdmin(userId: string): Promise<void> {
        const user = await UserModel.findById(userId).exec();
        if (user?.roleId === Role.Admin) {
            throw new ClientError(StatusCode.Forbidden, "Admin users cannot like vacations.");
        }
    }

    public async addLike(userId: string, vacationId: string): Promise<void> {
        await this.assertNotAdmin(userId);

        const existingLike = await LikeModel.findOne({ userId, vacationId }).exec();
        if (existingLike) {
            return; // Already liked - nothing to do.
        }

        const like = new LikeModel({ userId, vacationId });
        await ClientError.validate(like);
        await like.save();
    }

    public async removeLike(userId: string, vacationId: string): Promise<void> {
        await LikeModel.findOneAndDelete({ userId, vacationId }).exec();
    }

}

export const likeService = new LikeService();
