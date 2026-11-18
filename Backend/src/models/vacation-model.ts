import { Document, model, Schema, Types } from "mongoose";
import { UploadedFile } from "express-fileupload";
import { ClientError } from "./client-error";
import { StatusCode } from "./enums";

// 1. Interface:
export interface IVacationModel extends Document {
    _id: Types.ObjectId;
    destination: string;
    description: string;
    startDate: Date;
    endDate: Date;
    price: number;
    imageName: string;
    image?: UploadedFile; // Virtual field - only used during add/update, never saved to DB.
    validateBeforeAdd(): void;
}

// 2. Schema:
export const VacationSchema = new Schema<IVacationModel>({
    destination: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 100,
        trim: true,
        validate: {
            validator: (value: string) => /[a-zA-Z\u0590-\u05FF]/.test(value),
            message: "Destination name must contain letters and cannot be only numbers."
        }
    },
    description: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 1000,
        trim: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (this: IVacationModel, value: Date) {
                return value >= this.startDate;
            },
            message: "End date cannot be before start date."
        }
    },
    price: {
        type: Number,
        required: true,
        min: 0,
        max: 10000
    },
    imageName: {
        type: String,
        required: true,
        maxLength: 200
    }
}, {
    versionKey: false,
    toJSON: { virtuals: true }
});

// Virtual field - not stored in DB, computed from imageName on every response:
VacationSchema.virtual("imageUrl").get(function (this: IVacationModel) {
    return process.env.VACATION_IMAGES_BASE_URL + this.imageName;
});

// Business rules that apply only when a new vacation is added (not when an existing one is updated):
// an image is required, and the start date cannot be in the past.
VacationSchema.method("validateBeforeAdd", function (this: IVacationModel): void {

    if (!this.image) {
        throw new ClientError(StatusCode.BadRequest, "Vacation image is required.");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (new Date(this.startDate) < today) {
        throw new ClientError(StatusCode.UnprocessableContent, "Start date cannot be in the past.");
    }
});

// 3. Model:
export const VacationModel = model<IVacationModel>("VacationModel", VacationSchema, "vacations");
