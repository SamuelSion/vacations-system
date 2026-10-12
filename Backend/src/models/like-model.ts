import { Document, model, Schema, Types } from "mongoose";

// 1. Interface:
export interface ILikeModel extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    vacationId: Types.ObjectId;
}

// 2. Schema:
export const LikeSchema = new Schema<ILikeModel>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "UserModel"
    },
    vacationId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "VacationModel"
    }
}, {
    versionKey: false
});

// A user can like a specific vacation only once:
LikeSchema.index({ userId: 1, vacationId: 1 }, { unique: true });

// 3. Model:
export const LikeModel = model<ILikeModel>("LikeModel", LikeSchema, "likes");
