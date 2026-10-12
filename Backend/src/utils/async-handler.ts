import { NextFunction, Request, Response } from "express";

// Express 4 does not automatically forward a rejected Promise from an async
// route handler to the error-handling middleware (next(err) -> catchAll).
// Without this wrapper, a thrown ClientError inside an async controller
// method becomes an "UnhandledPromiseRejection" that crashes the entire
// server process, instead of reaching errorMiddleware.catchAll as intended.
// This helper simply calls .catch(next) on every async handler so the
// existing, already-taught next(err) pattern works reliably.
type AsyncRequestHandler = (request: Request, response: Response, next: NextFunction) => Promise<void>;

export function asyncHandler(handler: AsyncRequestHandler) {
    return (request: Request, response: Response, next: NextFunction): void => {
        handler(request, response, next).catch(next);
    };
}
