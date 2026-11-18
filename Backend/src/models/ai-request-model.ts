import z from "zod";
import { ClientError } from "./client-error";
import { StatusCode } from "./enums";

// Schemas:
const RecommendationRequestSchema = z.object({
    destination: z.string().trim().min(2, "Destination is required.")
});

const QuestionRequestSchema = z.object({
    question: z.string().trim().min(2, "Question is required.")
});

// Model - the body of a vacation recommendation request:
export class RecommendationRequestModel {

    public destination: string;

    public constructor(body: { destination?: unknown }) {
        this.destination = typeof body.destination === "string" ? body.destination : "";
    }

    public validate(): void {
        const result = RecommendationRequestSchema.safeParse(this);
        if (!result.success) {
            throw new ClientError(StatusCode.BadRequest, result.error.issues[0].message);
        }
    }

}

// Model - the body of a question for the vacations assistant:
export class QuestionRequestModel {

    public question: string;

    public constructor(body: { question?: unknown }) {
        this.question = typeof body.question === "string" ? body.question : "";
    }

    public validate(): void {
        const result = QuestionRequestSchema.safeParse(this);
        if (!result.success) {
            throw new ClientError(StatusCode.BadRequest, result.error.issues[0].message);
        }
    }

}
