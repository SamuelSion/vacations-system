import "../utils/test-env";
import { after, before, describe, it } from "mocha";
import { expect } from "chai";
import supertest from "supertest";
import { app, serverReady } from "../app";
import { UserModel } from "../models/user-model";
import { VacationModel, IVacationModel } from "../models/vacation-model";
import { LikeModel } from "../models/like-model";
import { Role, StatusCode } from "../models/enums";
import { TestUser, testHelper } from "../utils/test-helper";

interface VacationResponse {
    likesCount: number;
    likedByMe: boolean;
}

describe("LikeController", () => {

    let admin: TestUser;
    let regularUser: TestUser;
    let vacation: IVacationModel;

    // Reads the like info of the test vacation as the regular user:
    async function getVacationAsUser(): Promise<VacationResponse> {
        const response = await supertest(app.server).get(`/api/vacations/${vacation._id}`).auth(regularUser.token, { type: "bearer" });
        return response.body as VacationResponse;
    }

    before(async () => {
        await serverReady;
        admin = await testHelper.createUser(Role.Admin);
        regularUser = await testHelper.createUser(Role.User);
        vacation = await new VacationModel({
            destination: "Likes Test Destination",
            description: "A vacation that exists only for the likes tests.",
            startDate: new Date(testHelper.getDateFromToday(5)),
            endDate: new Date(testHelper.getDateFromToday(10)),
            price: 500,
            imageName: "paris-france.jpg"
        }).save();
    });

    after(async () => {
        await LikeModel.deleteMany({ vacationId: vacation._id }).exec();
        await VacationModel.deleteOne({ _id: vacation._id }).exec();
        await UserModel.deleteMany({ _id: { $in: [admin.user._id, regularUser.user._id] } }).exec();
    });

    it("should return 401 when liking without a token", async () => {
        const response = await supertest(app.server).post(`/api/likes/${vacation._id}`);
        expect(response.status).to.be.equal(StatusCode.Unauthorized);
    });

    it("should let a regular user like a vacation", async () => {
        const response = await supertest(app.server).post(`/api/likes/${vacation._id}`).auth(regularUser.token, { type: "bearer" });
        expect(response.status).to.be.equal(StatusCode.NoContent);
        const vacationInfo = await getVacationAsUser();
        expect(vacationInfo.likesCount).to.be.equal(1);
        expect(vacationInfo.likedByMe).to.be.equal(true);
    });

    it("should not count the same like twice", async () => {
        await supertest(app.server).post(`/api/likes/${vacation._id}`).auth(regularUser.token, { type: "bearer" });
        const vacationInfo = await getVacationAsUser();
        expect(vacationInfo.likesCount).to.be.equal(1);
    });

    it("should return 403 when an admin tries to like a vacation", async () => {
        const response = await supertest(app.server).post(`/api/likes/${vacation._id}`).auth(admin.token, { type: "bearer" });
        expect(response.status).to.be.equal(StatusCode.Forbidden);
    });

    it("should let a regular user unlike a vacation", async () => {
        const response = await supertest(app.server).delete(`/api/likes/${vacation._id}`).auth(regularUser.token, { type: "bearer" });
        expect(response.status).to.be.equal(StatusCode.NoContent);
        const vacationInfo = await getVacationAsUser();
        expect(vacationInfo.likesCount).to.be.equal(0);
        expect(vacationInfo.likedByMe).to.be.equal(false);
    });

});
