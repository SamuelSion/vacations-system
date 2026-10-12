import jwt, { SignOptions } from "jsonwebtoken";
import crypto from "crypto";
import { appConfig } from "./app-config";
import { IUserModel } from "../models/user-model";
import { Role } from "../models/enums";

class Cyber {

    // Hash a plain-text password with a salt (HMAC-SHA512).
    // Never store plain-text passwords in the database.
    public hash(plainText: string): string {
        const hashText = crypto
            .createHmac("sha512", appConfig.hashSalt)
            .update(plainText)
            .digest("hex");
        return hashText;
    }

    // Generate a token for a given logged-in / registered user:
    public generateToken(user: IUserModel): string {

        // Create a slim payload - never include the password:
        const payload = {
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                roleId: user.roleId
            }
        };

        const options: SignOptions = { expiresIn: "5h" };

        const token = jwt.sign(payload, appConfig.jwtSecret, options);
        return token;
    }

    // Verify a token is legal (structurally valid and not expired):
    public verifyToken(token: string): boolean {
        try {
            if (!token) return false;
            jwt.verify(token, appConfig.jwtSecret);
            return true;
        }
        catch (err: any) {
            return false;
        }
    }

    // Verify a token is legal AND belongs to an admin user:
    public verifyAdmin(token: string): boolean {
        try {
            if (!token) return false;
            jwt.verify(token, appConfig.jwtSecret);
            const payload = jwt.decode(token) as { user: { roleId: Role } };
            return payload.user.roleId === Role.Admin;
        }
        catch (err: any) {
            return false;
        }
    }

    // Extract the logged-in user's payload out of a request's Authorization header.
    // Returns undefined if there is no token (guest / not logged in).
    public getUserFromRequestHeader(authorizationHeader: string | undefined): { _id: string; roleId: Role } | undefined {
        const token = authorizationHeader?.substring(7);
        if (!token) return undefined;
        try {
            const payload = jwt.decode(token) as { user: { _id: string; roleId: Role } };
            return payload?.user;
        }
        catch (err: any) {
            return undefined;
        }
    }

}

export const cyber = new Cyber();
