import { describe, it } from "mocha";
import { expect } from "chai";
import { cyber } from "./cyber";
import { UserModel } from "../models/user-model";
import { Role } from "../models/enums";

function createUserDocument(roleId: Role): InstanceType<typeof UserModel> {
    return new UserModel({
        firstName: "Moshe",
        lastName: "Cohen",
        email: "moshe@vacations.com",
        password: "hashed-password",
        roleId
    });
}

describe("Cyber", () => {

    it("should return the same hash for the same text", () => {
        expect(cyber.hash("abcd")).to.be.equal(cyber.hash("abcd"));
    });

    it("should return different hashes for different texts", () => {
        expect(cyber.hash("abcd")).to.not.be.equal(cyber.hash("abce"));
    });

    it("should not return the plain text as the hash", () => {
        const hash = cyber.hash("abcd");
        expect(hash).to.not.be.equal("abcd");
        expect(hash).to.have.lengthOf(128);
    });

    it("should verify a token it generated", () => {
        const token = cyber.generateToken(createUserDocument(Role.User));
        expect(cyber.verifyToken(token)).to.be.equal(true);
    });

    it("should reject an invalid or empty token", () => {
        expect(cyber.verifyToken("not-a-real-token")).to.be.equal(false);
        expect(cyber.verifyToken("")).to.be.equal(false);
    });

    it("should not put the password inside the token", () => {
        const token = cyber.generateToken(createUserDocument(Role.User));
        const user = cyber.getUserFromRequestHeader(`Bearer ${token}`);
        expect(user).to.not.have.property("password");
    });

    it("should recognize an admin token", () => {
        const token = cyber.generateToken(createUserDocument(Role.Admin));
        expect(cyber.verifyAdmin(token)).to.be.equal(true);
    });

    it("should not treat a regular user token as admin", () => {
        const token = cyber.generateToken(createUserDocument(Role.User));
        expect(cyber.verifyAdmin(token)).to.be.equal(false);
    });

    it("should read the user out of the authorization header", () => {
        const token = cyber.generateToken(createUserDocument(Role.Admin));
        const user = cyber.getUserFromRequestHeader(`Bearer ${token}`);
        expect(user?.roleId).to.be.equal(Role.Admin);
        expect(user).to.contain.keys("_id", "roleId");
    });

    it("should return undefined when there is no authorization header", () => {
        expect(cyber.getUserFromRequestHeader(undefined)).to.be.equal(undefined);
    });

});
