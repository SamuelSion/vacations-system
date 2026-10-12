import { NextFunction, Request, Response } from "express";
import { cyber } from "../utils/cyber";
import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enums";

class SecurityMiddleware {

    public verifyLoggedIn(request: Request, response: Response, next: NextFunction): void {
        const authorization = request.headers.authorization; // "Bearer the-token..."
        const token = authorization?.substring(7);

        if (cyber.verifyToken(token!)) {
            next();
        }
        else {
            const err = new ClientError(StatusCode.Unauthorized, "You are not logged in.");
            next(err);
        }
    }

    public verifyAdmin(request: Request, response: Response, next: NextFunction): void {
        const authorization = request.headers.authorization;
        const token = authorization?.substring(7);

        if (cyber.verifyAdmin(token!)) {
            next();
        }
        else {
            const err = new ClientError(StatusCode.Forbidden, "You are not authorized.");
            next(err);
        }
    }

}

export const securityMiddleware = new SecurityMiddleware();
