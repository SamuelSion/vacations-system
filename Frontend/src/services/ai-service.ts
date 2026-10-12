import axios from "axios";
import { appConfig } from "../utils/app-config";

class AiService {

    public async getRecommendation(destination: string): Promise<string> {
        const url = `${appConfig.apiBaseUrl}/api/ai/recommendation`;
        const response = await axios.post<{ recommendation: string }>(url, { destination });
        return response.data.recommendation;
    }

    public async askAboutVacations(question: string): Promise<string> {
        const url = `${appConfig.apiBaseUrl}/api/ai/ask`;
        const response = await axios.post<{ answer: string }>(url, { question });
        return response.data.answer;
    }

}

export const aiService = new AiService();
