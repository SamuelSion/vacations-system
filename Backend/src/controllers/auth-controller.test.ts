import "../utils/test-env";
import { after, before, describe, it } from "mocha";
import { expect } from "chai";
import supertest from "supertest";
import { app, serverReady } from "../app";
import { UserModel } from "../models/user-model";
import { Role, StatusCode } from "../models/enums";
import { cyber } from "../utils/cyber";
import { TestUser, testHelper } from "../utils/test-helper";

describe("AuthController", () => {

    let existingUser: TestUser;
    const newUserEmail = `new-user-${Date.now()}@vacations-test.com`;

    before(async () => {
        await serverReady;
        existingUser = await testHelper.createUser(Role.User);
    });

    after(async () => {
        await UserModel.deleteMany({ email: { $in: [existingUser.user.email, newUserEmail] } }).exec();
    });

    it("should register a new user and return a token", async () => {
        const newUser = { firstName: "Noa", lastName: "Shapira", email: newUserEmail, password: "noa1234" };
        const response = await supertest(app.server).post("/api/auth/register").send(newUser);
        expect(response.status).to.be.equal(StatusCode.Created);
        expect(cyber.verifyToken(response.body as string)).to.be.equal(true);
    });

    it("should always register new users with the lowest role", async () => {
        const dbUser = await UserModel.findOne({ email: newUserEmail }).exec();
        expect(dbUser?.roleId).to.be.equal(Role.User);
        expect(dbUser?.password).to.not.be.equal("noa1234");
    });

    it("should ignore a role sent by the client on register", async () => {
        const email = `sneaky-${Date.now()}@vacations-test.com`;
        const sneakyUser = { firstName: "Sneaky", lastName: "Person", email, password: "1234", roleId: Role.Admin };
        const response = await supertest(app.server).post("/api/auth/register").send(sneakyUser);
        const dbUser = await UserModel.findOne({ email }).exec();
        await UserModel.deleteOne({ email }).exec();
        expect(response.status).to.be.equal(StatusCode.Created);
        expect(dbUser?.roleId).to.be.equal(Role.User);
    });

    it("should return 409 when the email is already taken", async () => {
        const duplicateUser = { firstName: "Dup", lastName: "Licate", email: existingUser.user.email, password: "1234" };
        const response = await supertest(app.server).post("/api/auth/register").send(duplicateUser);
        expect(response.status).to.be.equal(StatusCode.Conflict);
    });

    it("should return 422 when registering with invalid data", async () => {
        const invalidUser = { firstName: "A", lastName: "B", email: "not-an-email", password: "12" };
        const response = await supertest(app.server).post("/api/auth/register").send(invalidUser);
        expect(response.status).to.be.equal(StatusCode.UnprocessableContent);
    });

    it("should login with correct credentials", async () => {
        const credentials = { email: existingUser.user.email, password: existingUser.plainPassword };
        const response = await supertest(app.server).post("/api/auth/login").send(credentials);
        expect(response.status).to.be.equal(StatusCode.OK);
        expect(cyber.verifyToken(response.body as string)).to.be.equal(true);
    });

    it("should return 401 on a wrong password", async () => {
        const credentials = { email: existingUser.user.email, password: "wrong-password" };
        const response = await supertest(app.server).post("/api/auth/login").send(credentials);
        expect(response.status).to.be.equal(StatusCode.Unauthorized);
    });

    it("should return 401 on an email that does not exist", async () => {
        const credentials = { email: "nobody@vacations-test.com", password: "1234" };
        const response = await supertest(app.server).post("/api/auth/login").send(credentials);
        expect(response.status).to.be.equal(StatusCode.Unauthorized);
    });

    it("should return 422 when login fields are missing", async () => {
        const response = await supertest(app.server).post("/api/auth/login").send({});
        expect(response.status).to.be.equal(StatusCode.UnprocessableContent);
    });

});
