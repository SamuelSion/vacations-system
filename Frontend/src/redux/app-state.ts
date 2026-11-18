import { IUser } from "../models/user-model";
import { IVacationsState } from "./vacations-slice";

export type AppState = {
    user: IUser;
    vacations: IVacationsState;
};
