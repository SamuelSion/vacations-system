import axios from "axios";
import { appConfig } from "../utils/app-config";
import { formUtil } from "../utils/form-util";
import { IVacation, IVacationsResponse, IVacationFormData, VacationFilter } from "../models/vacation-model";

class VacationService {

    public async getVacations(filter: VacationFilter, page: number): Promise<IVacationsResponse> {
        const url = `${appConfig.apiBaseUrl}/api/vacations?filter=${filter}&page=${page}`;
        const response = await axios.get<IVacationsResponse>(url);
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
        return response.data;
    }

    public async updateVacation(_id: string, vacation: IVacationFormData): Promise<IVacation> {
        const url = `${appConfig.apiBaseUrl}/api/vacations/${_id}`;
        const response = await axios.put<IVacation>(url, formUtil.toFormData(vacation));
        return response.data;
    }

    public async deleteVacation(_id: string): Promise<void> {
        const url = `${appConfig.apiBaseUrl}/api/vacations/${_id}`;
        await axios.delete(url);
    }

}

export const vacationService = new VacationService();
