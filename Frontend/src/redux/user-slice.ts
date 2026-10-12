import { Action, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../models/user-model";

// Reducer - init a user (used by both Register and Login):
function initUser(_currentState: IUser, action: PayloadAction<IUser>): IUser {
    const userToInit = action.payload;
    return userToInit;
}

// Reducer - logout the user:
function logoutUser(_currentState: IUser, _action: Action): IUser {
    return null!;
}

export const userSlice = createSlice({
    name: "user",
    initialState: null! as IUser,
    reducers: {
        initUser,
        logoutUser
    }
});
