import { NextFunction, Request, Response } from "express";

// A controller method that returns a Promise:
type AsyncRequestHandler = (request: Request, response: Response, next: NextFunction) => Promise<void>;

class AsyncHandler {

    // Express 4 does not forward rejected Promises from async handlers to the error middleware,
    // so this wrapper calls .catch(next) - otherwise the server process can crash.
    // Every error then reaches the Catch-All middleware, so controllers and services need no try-catch.
    public wrap(handler: AsyncRequestHandler) {
        return (request: Request, response: Response, next: NextFunction): void => {
            handler(request, response, next).catch(next);
        };
    }

}

export const asyncHandler = new AsyncHandler();
