import { appConfig } from "../utils/app-config";
import OpenAI from "openai";
import { ChatCompletionCreateParamsNonStreaming } from "openai/resources";

class RecommendationService {

    private openai = new OpenAI({ apiKey: appConfig.openaiApiKey });

    public async getRecommendation(destination: string): Promise<string> {
        const systemPrompt = `
            You are a friendly travel expert. Given a vacation destination, provide a short,
            enthusiastic recommendation (3-5 bullet points) covering must-see sights, a food
            tip and a practical tip (best season / how to get around). Keep it concise.
        `;

        const body: ChatCompletionCreateParamsNonStreaming = {
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Give me vacation recommendations for: ${destination}` }
            ]
        };

        const response = await this.openai.chat.completions.create(body);
        return response.choices[0].message.content!;
    }

}

export const recommendationService = new RecommendationService();
