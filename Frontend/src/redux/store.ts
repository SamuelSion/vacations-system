import { configureStore } from "@reduxjs/toolkit";
import { AppState } from "./app-state";
import { userSlice } from "./user-slice";

// Store object - handling entire global state:
export const store = configureStore<AppState>({
    reducer: {
        user: userSlice.reducer
    }
});
