import { Document, model, Schema, Types } from "mongoose";
import { Role } from "./enums";

// 1. Interface:
export interface IUserModel extends Document {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    roleId: Role;
}

// 2. Schema:
export const UserSchema = new Schema<IUserModel>({
    firstName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50,
        trim: true
    },
    email: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 100,
        trim: true,
        lowercase: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
        type: String,
        required: true,
        minLength: 4
    },
    roleId: {
        type: Number,
        required: true,
        enum: [Role.User, Role.Admin],
        default: Role.User
    }
}, {
    versionKey: false,
    toJSON: {
        transform: (_document, returnedObject: Record<string, unknown>) => {
            delete returnedObject.password; // Never expose the password hash.
            return returnedObject;
        }
    }
});

// 3. Model:
export const UserModel = model<IUserModel>("UserModel", UserSchema, "users");
