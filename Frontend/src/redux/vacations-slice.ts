import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IVacationsResponse, VacationFilter } from "../models/vacation-model";

// The global state of the vacations: every page that was already loaded from the server,
// so going back to a page (or to a filter) does not require another trip to the server.
export interface IVacationsState {
    pages: Record<string, IVacationsResponse>;
}

// A page is identified by its filter and its number, e.g. "all:1" or "liked:2":
export function getVacationsPageKey(filter: VacationFilter, page: number): string {
    return `${filter}:${page}`;
}

// Reducer - keep a page that was loaded from the server:
function savePage(currentState: IVacationsState, action: PayloadAction<{ filter: VacationFilter; page: number; response: IVacationsResponse }>): void {
    const { filter, page, response } = action.payload;
    currentState.pages[getVacationsPageKey(filter, page)] = response;
}

// Reducer - forget all the loaded pages (after add / update / delete, or when another user logs in):
function clearPages(currentState: IVacationsState): void {
    currentState.pages = {};
}

// Reducer - a like / unlike was saved on the server, so update the loaded pages without asking the server again:
function applyLike(currentState: IVacationsState, action: PayloadAction<{ vacationId: string; liked: boolean }>): void {
    const { vacationId, liked } = action.payload;

    for (const key of Object.keys(currentState.pages)) {

        // The "liked" filter lists exactly the liked vacations, so its pages are no longer correct - load them again later:
        if (key.startsWith("liked:")) {
            delete currentState.pages[key];
            continue;
        }

        for (const vacation of currentState.pages[key].vacations) {
            if (vacation._id === vacationId) {
                vacation.likedByMe = liked;
                vacation.likesCount += liked ? 1 : -1;
            }
        }
    }
}

export const vacationsSlice = createSlice({
    name: "vacations",
    initialState: { pages: {} } as IVacationsState,
    reducers: {
        savePage,
        clearPages,
        applyLike
    }
});
