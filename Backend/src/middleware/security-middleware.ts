import { NextFunction, Request, Response } from "express";
import { cyber } from "../utils/cyber";
import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enums";

// Protects routes: every protected route runs one of these before its controller method.
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

    // Same as above, and the token must also belong to an admin (otherwise 403):
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
