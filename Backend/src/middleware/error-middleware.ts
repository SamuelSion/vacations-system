import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../models/enums";
import { ClientError } from "../models/client-error";
import colors from "colors";

class ErrorMiddleware {

    // Reads the HTTP status from a ClientError or any error object that carries a numeric status.
    // The helpers are static, because Express calls the middleware methods without "this":
    private static getStatus(err: unknown): number {
        if (err instanceof ClientError) return err.status;
        if (typeof err === "object" && err !== null && "status" in err && typeof err.status === "number") return err.status;
        return StatusCode.InternalServerError;
    }

    // Reads the message from a ClientError or an Error, with a generic fallback:
    private static getMessage(err: unknown): string {
        if (err instanceof ClientError || err instanceof Error) return err.message || "Something went wrong.";
        return "Something went wrong.";
    }

    // Route Not Found Middleware:
    public routeNotFound(request: Request, response: Response, next: NextFunction): void {
        const err = new ClientError(StatusCode.NotFound, `Route ${request.originalUrl} on method ${request.method} not found.`);
        next(err);
    }

    // Ping Middleware - used by the Docker healthcheck:
    public ping(request: Request, response: Response, next: NextFunction): void {
        response.send("pong");
    }

    // Catch-All Middleware - every error thrown anywhere in the request flow ends up here:
    public catchAll(err: unknown, request: Request, response: Response, next: NextFunction): void {
        const status = ErrorMiddleware.getStatus(err);
        const message = ErrorMiddleware.getMessage(err);
        console.log(colors.red(message));
        response.status(status).json({ message });
    }

}

export const errorMiddleware = new ErrorMiddleware();
