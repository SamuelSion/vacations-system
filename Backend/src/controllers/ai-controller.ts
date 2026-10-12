import express, { Request, Response, Router } from "express";
import { recommendationService } from "../services/recommendation-service";
import { vacationAgent } from "../ai/vacation-agent";
import { securityMiddleware } from "../middleware/security-middleware";
import { StatusCode } from "../models/enums";
import { ClientError } from "../models/client-error";
import { asyncHandler } from "../utils/async-handler";

class AiController {

    public router: Router = express.Router();

    public constructor() {
        this.router.post("/api/ai/recommendation", securityMiddleware.verifyLoggedIn, asyncHandler(this.getRecommendation));
        this.router.post("/api/ai/ask", securityMiddleware.verifyLoggedIn, asyncHandler(this.askAboutVacations));
    }

    private async getRecommendation(request: Request, response: Response): Promise<void> {
        const destination = request.body.destination as string;
        if (!destination || destination.trim().length < 2) {
            throw new ClientError(StatusCode.BadRequest, "Destination is required.");
        }
        const recommendation = await recommendationService.getRecommendation(destination);
        response.json({ recommendation });
    }

    private async askAboutVacations(request: Request, response: Response): Promise<void> {
        const question = request.body.question as string;
        if (!question || question.trim().length < 2) {
            throw new ClientError(StatusCode.BadRequest, "Question is required.");
        }
        const answer = await vacationAgent.ask(question);
        response.json({ answer });
    }

}

export const aiController = new AiController();
