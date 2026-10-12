import { Document } from "mongoose";
import { StatusCode } from "./enums";

export class ClientError {

    public readonly status: StatusCode;
    public readonly message: string;

    public constructor(status: StatusCode, message: string) {
        this.status = status;
        this.message = message;
    }

    // Runs mongoose schema validation on a document and converts
    // a validation failure into a ClientError with 422 status.
    public static async validate(document: Document): Promise<void> {
        try {
            await document.validate();
        }
        catch (err: any) {
            throw new ClientError(StatusCode.UnprocessableContent, err.message);
        }
    }

}
