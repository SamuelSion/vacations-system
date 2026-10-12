import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../models/enums";
import { ClientError } from "../models/client-error";
import colors from "colors";

class ErrorMiddleware {

    // Route Not Found Middleware:
    public routeNotFound(request: Request, response: Response, next: NextFunction): void {
        const err = new ClientError(StatusCode.NotFound, `Route ${request.originalUrl} on method ${request.method} not found.`);
        next(err);
    }

    // Ping Middleware - used by the Docker healthcheck:
    public ping(request: Request, response: Response, next: NextFunction): void {
        response.send("pong");
    }

    // Catch-All Middleware:
    public catchAll(err: any, request: Request, response: Response, next: NextFunction): void {
        const status = err.status || StatusCode.InternalServerError;
        const message = err.message || "Something went wrong.";
        console.log(colors.red(message));
        response.status(status).json({ message });
    }

}

export const errorMiddleware = new ErrorMiddleware();
