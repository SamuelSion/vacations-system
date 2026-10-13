import { describe, expect, it } from "vitest";
import { userSlice } from "./user-slice";
import { IUser } from "../models/user-model";
import { Role } from "../models/role";

const sampleUser: IUser = {
    _id: "665f1c2e8b3a4d0012ab34ce",
    firstName: "Moshe",
    lastName: "Cohen",
    email: "moshe@vacations.com",
    roleId: Role.User
};

describe("UserSlice", () => {

    it("should start with no user", () => {
        const state = userSlice.reducer(undefined, { type: "unknown" });
        expect(state).toBeNull();
    });

    it("should init a user", () => {
        const state = userSlice.reducer(null!, userSlice.actions.initUser(sampleUser));
        expect(state.firstName).toBe("Moshe");
        expect(state.roleId).toBe(Role.User);
    });

    it("should logout the user", () => {
        const loggedInState = userSlice.reducer(null!, userSlice.actions.initUser(sampleUser));
        const state = userSlice.reducer(loggedInState, userSlice.actions.logoutUser());
        expect(state).toBeNull();
    });

});
