import express, { Request, Response, Router } from "express";
import { userService } from "../services/user-service";
import { UserModel } from "../models/user-model";
import { CredentialsModel } from "../models/credentials-model";
import { StatusCode } from "../models/enums";
import { asyncHandler } from "../utils/async-handler";

// Register and login - the only routes that do not require a logged-in user.
class AuthController {

    public router: Router = express.Router();

    public constructor() {
        this.router.post("/api/auth/register", asyncHandler.wrap(this.register));
        this.router.post("/api/auth/login", asyncHandler.wrap(this.login));
    }

    // Registers a new user and answers with a token, so the new user is logged in right away:
    private async register(request: Request, response: Response): Promise<void> {
        const user = new UserModel(request.body);
        const token = await userService.register(user);
        response.status(StatusCode.Created).json(token);
    }

    // Checks the credentials and answers with a token:
    private async login(request: Request, response: Response): Promise<void> {
        const credentials = new CredentialsModel(request.body);
        const token = await userService.login(credentials);
        response.status(StatusCode.OK).json(token);
    }

}

export const authController = new AuthController();
