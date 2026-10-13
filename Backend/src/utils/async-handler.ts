import { NextFunction, Request, Response } from "express";

// Express 4 does not forward rejected Promises from async handlers to the error middleware,
// so this wrapper calls .catch(next) - otherwise the server process can crash.
type AsyncRequestHandler = (request: Request, response: Response, next: NextFunction) => Promise<void>;

export function asyncHandler(handler: AsyncRequestHandler) {
    return (request: Request, response: Response, next: NextFunction): void => {
        handler(request, response, next).catch(next);
    };
}
