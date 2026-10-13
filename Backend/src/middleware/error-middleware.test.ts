import "../utils/test-env";
import { before, describe, it } from "mocha";
import { expect } from "chai";
import supertest from "supertest";
import { app, serverReady } from "../app";
import { StatusCode } from "../models/enums";

describe("ErrorMiddleware", () => {

    before(async () => {
        await serverReady;
    });

    it("should answer pong on the healthcheck route", async () => {
        const response = await supertest(app.server).get("/ping");
        expect(response.status).to.be.equal(StatusCode.OK);
        expect(response.text).to.be.equal("pong");
    });

    it("should return 404 with a message when the route does not exist", async () => {
        const response = await supertest(app.server).get("/api/there-is-nothing-here");
        const body = response.body as { message: string };
        expect(response.status).to.be.equal(StatusCode.NotFound);
        expect(body.message).to.contain("/api/there-is-nothing-here");
    });

});
