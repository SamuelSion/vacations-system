import { NextFunction, Request, Response } from "express";
import colors from "colors";

class LoggerMiddleware {

    // Pass-Through Middleware:
    public logToConsole(request: Request, response: Response, next: NextFunction): void {
        const method = request.method;
        const route = request.originalUrl;
        console.log(colors.cyan(`${method} ${route}`));
        next();
    }

}

export const loggerMiddleware = new LoggerMiddleware();
