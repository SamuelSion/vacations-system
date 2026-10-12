import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { appConfig } from "../utils/app-config";
import { IUser, IRegisterData, ICredentials } from "../models/user-model";
import { userSlice } from "../redux/user-slice";
import { store } from "../redux/store";

class UserService {

    public constructor() {
        // Get token from local storage:
        const token = localStorage.getItem("token");

        // If we have a token - restore the user into global state:
        if (token) {
            const dbUser = jwtDecode<{ user: IUser }>(token).user;
            const action = userSlice.actions.initUser(dbUser);
            store.dispatch(action);
        }
    }

    // Register new user:
    public async register(user: IRegisterData): Promise<void> {
        const url = appConfig.apiBaseUrl + "/api/auth/register";
        const response = await axios.post<string>(url, user);
        const token = response.data;

        localStorage.setItem("token", token);

        const dbUser = jwtDecode<{ user: IUser }>(token).user;
        const action = userSlice.actions.initUser(dbUser);
        store.dispatch(action);
    }

    // Login existing user:
    public async login(credentials: ICredentials): Promise<void> {
        const url = appConfig.apiBaseUrl + "/api/auth/login";
        const response = await axios.post<string>(url, credentials);
        const token = response.data;

        localStorage.setItem("token", token);

        const dbUser = jwtDecode<{ user: IUser }>(token).user;
        const action = userSlice.actions.initUser(dbUser);
        store.dispatch(action);
    }

    // Logout current user:
    public logout(): void {
        localStorage.removeItem("token");
        const action = userSlice.actions.logoutUser();
        store.dispatch(action);
    }

}

export const userService = new UserService();
