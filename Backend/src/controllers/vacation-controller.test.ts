import "../utils/test-env";
import path from "path";
import { after, before, describe, it } from "mocha";
import { expect } from "chai";
import supertest from "supertest";
import { app, serverReady } from "../app";
import { UserModel } from "../models/user-model";
import { VacationModel } from "../models/vacation-model";
import { Role, StatusCode } from "../models/enums";
import { TestUser, testHelper } from "../utils/test-helper";

interface VacationResponse {
    _id: string;
    destination: string;
    price: number;
    likesCount: number;
    likedByMe: boolean;
    imageUrl: string;
}

interface VacationsPageResponse {
    vacations: VacationResponse[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
}

describe("VacationController", () => {

    let admin: TestUser;
    let regularUser: TestUser;
    let vacationId: string;
    const imagePath = path.join(__dirname, "..", "assets", "images", "paris-france.jpg");

    // Sends a multipart "add vacation" request as the given token:
    function postVacation(token: string, startDate: string, endDate: string) {
        return supertest(app.server)
            .post("/api/vacations")
            .auth(token, { type: "bearer" })
            .field("destination", "Test Destination")
            .field("description", "A description that is long enough to pass validation.")
            .field("startDate", startDate)
            .field("endDate", endDate)
            .field("price", "999")
            .attach("image", imagePath);
    }

    before(async () => {
        await serverReady;
        admin = await testHelper.createUser(Role.Admin);
        regularUser = await testHelper.createUser(Role.User);
    });

    after(async () => {
        await VacationModel.deleteMany({ destination: "Test Destination" }).exec();
        await UserModel.deleteMany({ _id: { $in: [admin.user._id, regularUser.user._id] } }).exec();
    });

    it("should return 401 when getting vacations without a token", async () => {
        const response = await supertest(app.server).get("/api/vacations");
        expect(response.status).to.be.equal(StatusCode.Unauthorized);
    });

    it("should return a page of vacations for a logged in user", async () => {
        const response = await supertest(app.server).get("/api/vacations").auth(regularUser.token, { type: "bearer" });
        const body = response.body as VacationsPageResponse;
        expect(response.status).to.be.equal(StatusCode.OK);
        expect(body).to.contain.keys("vacations", "totalCount", "totalPages", "currentPage");
        expect(body.vacations.length).to.be.lessThanOrEqual(9);
    });

    it("should return 403 when a regular user tries to add a vacation", async () => {
        const response = await postVacation(regularUser.token, testHelper.getDateFromToday(5), testHelper.getDateFromToday(10));
        expect(response.status).to.be.equal(StatusCode.Forbidden);
    });

    it("should return 400 when adding a vacation without an image", async () => {
        const vacation = {
            destination: "Test Destination",
            description: "A description that is long enough to pass validation.",
            startDate: testHelper.getDateFromToday(5),
            endDate: testHelper.getDateFromToday(10),
            price: 999
        };
        const response = await supertest(app.server).post("/api/vacations").auth(admin.token, { type: "bearer" }).send(vacation);
        expect(response.status).to.be.equal(StatusCode.BadRequest);
    });

    it("should return 422 when the start date is in the past", async () => {
        const response = await postVacation(admin.token, testHelper.getDateFromToday(-3), testHelper.getDateFromToday(5));
        expect(response.status).to.be.equal(StatusCode.UnprocessableContent);
    });

    it("should return 422 when the end date is before the start date", async () => {
        const response = await postVacation(admin.token, testHelper.getDateFromToday(10), testHelper.getDateFromToday(5));
        expect(response.status).to.be.equal(StatusCode.UnprocessableContent);
    });

    it("should add a vacation with an image as admin", async () => {
        const response = await postVacation(admin.token, testHelper.getDateFromToday(5), testHelper.getDateFromToday(10));
        const vacation = response.body as VacationResponse;
        vacationId = vacation._id;
        expect(response.status).to.be.equal(StatusCode.Created);
        expect(vacation).to.contain.keys("_id", "destination", "price", "imageUrl");
        expect(vacation.imageUrl).to.contain("/api/vacations/images/");
    });

    it("should return the added vacation by id with like info", async () => {
        const response = await supertest(app.server).get(`/api/vacations/${vacationId}`).auth(regularUser.token, { type: "bearer" });
        const vacation = response.body as VacationResponse;
        expect(response.status).to.be.equal(StatusCode.OK);
        expect(vacation.destination).to.be.equal("Test Destination");
        expect(vacation.likesCount).to.be.equal(0);
        expect(vacation.likedByMe).to.be.equal(false);
    });

    it("should update a vacation as admin", async () => {
        const updatedVacation = {
            destination: "Test Destination",
            description: "An updated description that is long enough.",
            startDate: testHelper.getDateFromToday(6),
            endDate: testHelper.getDateFromToday(12),
            price: 1500
        };
        const response = await supertest(app.server).put(`/api/vacations/${vacationId}`).auth(admin.token, { type: "bearer" }).send(updatedVacation);
        const vacation = response.body as VacationResponse;
        expect(response.status).to.be.equal(StatusCode.OK);
        expect(vacation.price).to.be.equal(1500);
    });

    it("should return 422 when updating with an end date before the start date", async () => {
        const invalidVacation = {
            destination: "Test Destination",
            description: "An updated description that is long enough.",
            startDate: testHelper.getDateFromToday(12),
            endDate: testHelper.getDateFromToday(6),
            price: 1500
        };
        const response = await supertest(app.server).put(`/api/vacations/${vacationId}`).auth(admin.token, { type: "bearer" }).send(invalidVacation);
        expect(response.status).to.be.equal(StatusCode.UnprocessableContent);
    });

    it("should return 403 when a regular user tries to delete a vacation", async () => {
        const response = await supertest(app.server).delete(`/api/vacations/${vacationId}`).auth(regularUser.token, { type: "bearer" });
        expect(response.status).to.be.equal(StatusCode.Forbidden);
    });

    it("should delete a vacation as admin", async () => {
        const response = await supertest(app.server).delete(`/api/vacations/${vacationId}`).auth(admin.token, { type: "bearer" });
        expect(response.status).to.be.equal(StatusCode.NoContent);
    });

    it("should return 404 for a vacation that was deleted", async () => {
        const response = await supertest(app.server).get(`/api/vacations/${vacationId}`).auth(regularUser.token, { type: "bearer" });
        expect(response.status).to.be.equal(StatusCode.NotFound);
    });

});
