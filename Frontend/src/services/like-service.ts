import axios from "axios";
import { appConfig } from "../utils/app-config";

class LikeService {

    public async addLike(vacationId: string): Promise<void> {
        const url = `${appConfig.apiBaseUrl}/api/likes/${vacationId}`;
        await axios.post(url);
    }

    public async removeLike(vacationId: string): Promise<void> {
        const url = `${appConfig.apiBaseUrl}/api/likes/${vacationId}`;
        await axios.delete(url);
    }

}

export const likeService = new LikeService();
