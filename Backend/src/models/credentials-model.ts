import z from "zod";
import { ClientError } from "./client-error";
import { StatusCode } from "./enums";

// Schema:
const CredentialsSchema = z.object({
    email: z.string().min(5).max(100),
    password: z.string().min(4).max(100)
});

type ICredentialsModel = z.infer<typeof CredentialsSchema>;

// Model:
export class CredentialsModel implements ICredentialsModel {

    public email: string;
    public password: string;

    public constructor(credentials: ICredentialsModel) {
        this.email = credentials.email;
        this.password = credentials.password;
    }

    public validate(): void {
        const result = CredentialsSchema.safeParse(this);
        if (!result.success) {
            const message = result.error.issues[0].path + ": " + result.error.issues[0].message;
            throw new ClientError(StatusCode.UnprocessableContent, message);
        }
    }

}
