import { describe, it } from "mocha";
import { expect } from "chai";
import { CredentialsModel } from "./credentials-model";
import { ClientError } from "./client-error";
import { StatusCode } from "./enums";
import { testHelper } from "../utils/test-helper";

describe("CredentialsModel", () => {

    it("should accept valid credentials", () => {
        const credentials = new CredentialsModel({ email: "moshe@vacations.com", password: "1234" });
        const error = testHelper.getThrownError(() => credentials.validate());
        expect(error).to.be.equal(undefined);
    });

    it("should reject a too short email with 422", () => {
        const credentials = new CredentialsModel({ email: "a@b", password: "1234" });
        const error = testHelper.getThrownError(() => credentials.validate());
        expect(error).to.be.instanceOf(ClientError);
        expect((error as ClientError).status).to.be.equal(StatusCode.UnprocessableContent);
    });

    it("should reject a too short password with 422", () => {
        const credentials = new CredentialsModel({ email: "moshe@vacations.com", password: "123" });
        const error = testHelper.getThrownError(() => credentials.validate());
        expect(error).to.be.instanceOf(ClientError);
        expect((error as ClientError).status).to.be.equal(StatusCode.UnprocessableContent);
    });

});
