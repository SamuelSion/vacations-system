import express, { Request, Response, Router } from "express";
import { recommendationService } from "../services/recommendation-service";
import { vacationAgent } from "../ai/vacation-agent";
import { securityMiddleware } from "../middleware/security-middleware";
import { RecommendationRequestModel, QuestionRequestModel } from "../models/ai-request-model";
import { asyncHandler } from "../utils/async-handler";

// The AI features - available for logged-in users. The OpenAI key stays on the server.
class AiController {

    public router: Router = express.Router();

    public constructor() {
        this.router.post("/api/ai/recommendation", securityMiddleware.verifyLoggedIn, asyncHandler.wrap(this.getRecommendation));
        this.router.post("/api/ai/ask", securityMiddleware.verifyLoggedIn, asyncHandler.wrap(this.askAboutVacations));
    }

    // A short AI recommendation about a destination:
    private async getRecommendation(request: Request, response: Response): Promise<void> {
        const recommendationRequest = new RecommendationRequestModel(request.body);
        recommendationRequest.validate();
        const recommendation = await recommendationService.getRecommendation(recommendationRequest.destination);
        response.json({ recommendation });
    }

    // Free-text question about the vacations: an AI agent answers it using the MCP server tools:
    private async askAboutVacations(request: Request, response: Response): Promise<void> {
        const questionRequest = new QuestionRequestModel(request.body);
        questionRequest.validate();
        const answer = await vacationAgent.ask(questionRequest.question);
        response.json({ answer });
    }

}

export const aiController = new AiController();
