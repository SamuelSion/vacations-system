import express, { Request, Response, Router } from "express";
import { likeService } from "../services/like-service";
import { StatusCode } from "../models/enums";
import { securityMiddleware } from "../middleware/security-middleware";
import { cyber } from "../utils/cyber";
import { ClientError } from "../models/client-error";
import { asyncHandler } from "../utils/async-handler";

class LikeController {

    public router: Router = express.Router();

    public constructor() {
        this.router.post("/api/likes/:vacationId", securityMiddleware.verifyLoggedIn, asyncHandler(this.addLike));
        this.router.delete("/api/likes/:vacationId", securityMiddleware.verifyLoggedIn, asyncHandler(this.removeLike));
    }

    private async addLike(request: Request, response: Response): Promise<void> {
        const user = cyber.getUserFromRequestHeader(request.headers.authorization);
        if (!user) throw new ClientError(StatusCode.Unauthorized, "You are not logged in.");
        await likeService.addLike(user._id, request.params.vacationId);
        response.sendStatus(StatusCode.NoContent);
    }

    private async removeLike(request: Request, response: Response): Promise<void> {
        const user = cyber.getUserFromRequestHeader(request.headers.authorization);
        if (!user) throw new ClientError(StatusCode.Unauthorized, "You are not logged in.");
        await likeService.removeLike(user._id, request.params.vacationId);
        response.sendStatus(StatusCode.NoContent);
    }

}

export const likeController = new LikeController();
