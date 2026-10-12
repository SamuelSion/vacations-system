import { UserModel, IUserModel } from "../models/user-model";
import { CredentialsModel } from "../models/credentials-model";
import { ClientError } from "../models/client-error";
import { StatusCode, Role } from "../models/enums";
import { cyber } from "../utils/cyber";

class UserService {

    private async isEmailTaken(email: string): Promise<boolean> {
        const existingUser = await UserModel.findOne({ email: email.toLowerCase() }).exec();
        return !!existingUser;
    }

    public async register(user: IUserModel): Promise<string> {

        // Never trust a role coming from the client - always force the lowest role:
        user.roleId = Role.User;

        if (await this.isEmailTaken(user.email)) {
            throw new ClientError(StatusCode.Conflict, "Email already taken.");
        }

        await ClientError.validate(user);

        user.password = cyber.hash(user.password);

        const dbUser = await user.save();
        const token = cyber.generateToken(dbUser);
        return token;
    }

    public async login(credentials: CredentialsModel): Promise<string> {
        credentials.validate();

        const hashedPassword = cyber.hash(credentials.password);

        const dbUser = await UserModel.findOne({
            email: credentials.email.toLowerCase(),
            password: hashedPassword
        }).exec();

        if (!dbUser) {
            throw new ClientError(StatusCode.Unauthorized, "Incorrect email or password.");
        }

        const token = cyber.generateToken(dbUser);
        return token;
    }

}

export const userService = new UserService();
