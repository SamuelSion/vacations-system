import { Role } from "./role";

export interface IUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    roleId: Role;
}

export interface IRegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface ICredentials {
    email: string;
    password: string;
}
