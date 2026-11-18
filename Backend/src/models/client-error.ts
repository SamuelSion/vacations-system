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
    // Optionally skips fields that do not have a value yet (e.g. a file name that is created after validation).
    public static async validate(document: Document, pathsToSkip: string[] = []): Promise<void> {
        try {
            await document.validate({ pathsToSkip });
        }
        catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Validation failed.";
            throw new ClientError(StatusCode.UnprocessableContent, message);
        }
    }

}
