import axios from "axios";
import { appConfig } from "../utils/app-config";
import { store } from "../redux/store";
import { vacationsSlice } from "../redux/vacations-slice";

// Likes are saved on the server, and then the already loaded pages in Redux are updated - no need to load them again.
class LikeService {

    public async addLike(vacationId: string): Promise<void> {
        const url = `${appConfig.apiBaseUrl}/api/likes/${vacationId}`;
        await axios.post(url);
        store.dispatch(vacationsSlice.actions.applyLike({ vacationId, liked: true }));
    }

    public async removeLike(vacationId: string): Promise<void> {
        const url = `${appConfig.apiBaseUrl}/api/likes/${vacationId}`;
        await axios.delete(url);
        store.dispatch(vacationsSlice.actions.applyLike({ vacationId, liked: false }));
    }

}

export const likeService = new LikeService();
