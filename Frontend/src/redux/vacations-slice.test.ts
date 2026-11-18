import { describe, expect, it } from "vitest";
import { vacationsSlice, getVacationsPageKey, IVacationsState } from "./vacations-slice";
import { IVacation, IVacationsResponse } from "../models/vacation-model";

const sampleVacation: IVacation = {
    _id: "665f1c2e8b3a4d0012ab34ce",
    destination: "Paris, France",
    description: "A vacation description that is long enough.",
    startDate: "2026-12-01T00:00:00.000Z",
    endDate: "2026-12-10T00:00:00.000Z",
    price: 1000,
    imageName: "image.jpg",
    imageUrl: "http://localhost:4000/api/vacations/images/image.jpg",
    likesCount: 2,
    likedByMe: false
};

const samplePage: IVacationsResponse = {
    vacations: [sampleVacation],
    totalCount: 1,
    totalPages: 1,
    currentPage: 1
};

// A state that already holds an "all" page and a "liked" page:
function createLoadedState(): IVacationsState {
    let state = vacationsSlice.reducer(undefined, { type: "unknown" });
    state = vacationsSlice.reducer(state, vacationsSlice.actions.savePage({ filter: "all", page: 1, response: samplePage }));
    state = vacationsSlice.reducer(state, vacationsSlice.actions.savePage({ filter: "liked", page: 1, response: samplePage }));
    return state;
}

describe("VacationsSlice", () => {

    it("should start without any loaded page", () => {
        const state = vacationsSlice.reducer(undefined, { type: "unknown" });
        expect(Object.keys(state.pages)).toHaveLength(0);
    });

    it("should keep a loaded page under its filter and page number", () => {
        const state = createLoadedState();
        expect(state.pages[getVacationsPageKey("all", 1)].vacations[0].destination).toBe("Paris, France");
        expect(state.pages[getVacationsPageKey("all", 2)]).toBeUndefined();
    });

    it("should forget all the loaded pages", () => {
        const state = vacationsSlice.reducer(createLoadedState(), vacationsSlice.actions.clearPages());
        expect(Object.keys(state.pages)).toHaveLength(0);
    });

    it("should update the likes of a vacation in the loaded pages", () => {
        const state = vacationsSlice.reducer(createLoadedState(), vacationsSlice.actions.applyLike({ vacationId: sampleVacation._id, liked: true }));
        const vacation = state.pages[getVacationsPageKey("all", 1)].vacations[0];
        expect(vacation.likedByMe).toBe(true);
        expect(vacation.likesCount).toBe(3);
    });

    it("should decrease the likes on unlike", () => {
        const likedState = vacationsSlice.reducer(createLoadedState(), vacationsSlice.actions.applyLike({ vacationId: sampleVacation._id, liked: true }));
        const state = vacationsSlice.reducer(likedState, vacationsSlice.actions.applyLike({ vacationId: sampleVacation._id, liked: false }));
        const vacation = state.pages[getVacationsPageKey("all", 1)].vacations[0];
        expect(vacation.likedByMe).toBe(false);
        expect(vacation.likesCount).toBe(2);
    });

    it("should drop the pages of the liked filter after a like change", () => {
        const state = vacationsSlice.reducer(createLoadedState(), vacationsSlice.actions.applyLike({ vacationId: sampleVacation._id, liked: true }));
        expect(state.pages[getVacationsPageKey("liked", 1)]).toBeUndefined();
        expect(state.pages[getVacationsPageKey("all", 1)]).toBeDefined();
    });

});
