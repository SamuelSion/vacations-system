import axios from "axios";
import { store } from "../redux/store";
import { vacationsSlice, getVacationsPageKey } from "../redux/vacations-slice";
import { appConfig } from "../utils/app-config";
import { formUtil } from "../utils/form-util";
import { IVacation, IVacationsResponse, IVacationFormData, VacationFilter } from "../models/vacation-model";

class VacationService {

    public async getVacations(filter: VacationFilter, page: number): Promise<IVacationsResponse> {

        // A page that was already loaded is taken from Redux - no trip to the server:
        const cachedPage = store.getState().vacations.pages[getVacationsPageKey(filter, page)];
        if (cachedPage) return cachedPage;

        const url = `${appConfig.apiBaseUrl}/api/vacations?filter=${filter}&page=${page}`;
        const response = await axios.get<IVacationsResponse>(url);
        store.dispatch(vacationsSlice.actions.savePage({ filter, page, response: response.data }));
        return response.data;
    }

    public async getOneVacation(_id: string): Promise<IVacation> {
        const url = `${appConfig.apiBaseUrl}/api/vacations/${_id}`;
        const response = await axios.get<IVacation>(url);
        return response.data;
    }

    public async addVacation(vacation: IVacationFormData): Promise<IVacation> {
        const url = `${appConfig.apiBaseUrl}/api/vacations`;
        const response = await axios.post<IVacation>(url, formUtil.toFormData(vacation));
        store.dispatch(vacationsSlice.actions.clearPages()); // The loaded pages are outdated now.
        return response.data;
    }

    public async updateVacation(_id: string, vacation: IVacationFormData): Promise<IVacation> {
        const url = `${appConfig.apiBaseUrl}/api/vacations/${_id}`;
        const response = await axios.put<IVacation>(url, formUtil.toFormData(vacation));
        store.dispatch(vacationsSlice.actions.clearPages()); // The loaded pages are outdated now.
        return response.data;
    }

    public async deleteVacation(_id: string): Promise<void> {
        const url = `${appConfig.apiBaseUrl}/api/vacations/${_id}`;
        await axios.delete(url);
        store.dispatch(vacationsSlice.actions.clearPages()); // The loaded pages are outdated now.
    }

    // True when the server answered "404 Not Found" (the vacation does not exist):
    public isNotFoundError(err: unknown): boolean {
        return axios.isAxiosError(err) && err.response?.status === 404;
    }

}

export const vacationService = new VacationService();
