import { cyber } from "./cyber";
import { IUserModel, UserModel } from "../models/user-model";
import { Role } from "../models/enums";

export interface TestUser {
    user: IUserModel;
    plainPassword: string;
    token: string;
}

class TestHelper {

    // Create a real user in the DB (with a hashed password) and a token for it:
    public async createUser(roleId: Role): Promise<TestUser> {
        const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
        const plainPassword = "test1234";
        const user = new UserModel({
            firstName: "Test",
            lastName: "Person",
            email: `test-${uniqueId}@vacations-test.com`,
            password: cyber.hash(plainPassword),
            roleId
        });
        await user.save();
        const token = cyber.generateToken(user);
        return { user, plainPassword, token };
    }

    // Returns the error thrown by an action, or undefined if nothing was thrown:
    public getThrownError(action: () => void): unknown {
        try {
            action();
            return undefined;
        }
        catch (err: unknown) {
            return err;
        }
    }

    // Returns a date (YYYY-MM-DD) that is the given number of days from today:
    public getDateFromToday(daysFromToday: number): string {
        const date = new Date();
        date.setDate(date.getDate() + daysFromToday);
        return date.toISOString().substring(0, 10);
    }

}

export const testHelper = new TestHelper();
