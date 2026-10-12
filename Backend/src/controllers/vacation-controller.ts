import express, { Request, Response, Router } from "express";
import { vacationService, VacationFilter } from "../services/vacation-service";
import { VacationModel } from "../models/vacation-model";
import { StatusCode } from "../models/enums";
import { securityMiddleware } from "../middleware/security-middleware";
import { cyber } from "../utils/cyber";
import { saver } from "../utils/image-saver";
import { asyncHandler } from "../utils/async-handler";
import { UploadedFile } from "express-fileupload";

// express-fileupload allows multiple files under the same field name (an array);
// this form always sends a single image, so take the first one if that happens.
function getSingleUploadedFile(files: UploadedFile | UploadedFile[] | undefined): UploadedFile | undefined {
    if (!files) return undefined;
    return Array.isArray(files) ? files[0] : files;
}

class VacationController {

    public router: Router = express.Router();

    public constructor() {
        this.router.get("/api/vacations", securityMiddleware.verifyLoggedIn, asyncHandler(this.getVacations));
        this.router.get("/api/vacations/images/:imageName", this.getImage);
        this.router.get("/api/vacations/:_id", securityMiddleware.verifyLoggedIn, asyncHandler(this.getOneVacation));
        this.router.post("/api/vacations", securityMiddleware.verifyAdmin, asyncHandler(this.addVacation));
        this.router.put("/api/vacations/:_id", securityMiddleware.verifyAdmin, asyncHandler(this.updateVacation));
        this.router.delete("/api/vacations/:_id", securityMiddleware.verifyAdmin, asyncHandler(this.deleteVacation));
    }

    private async getVacations(request: Request, response: Response): Promise<void> {
        const filter = (request.query.filter as VacationFilter) || "all";
        const page = Number(request.query.page) || 1;
        const user = cyber.getUserFromRequestHeader(request.headers.authorization);
        const result = await vacationService.getVacations(filter, page, user?._id);
        response.json(result);
    }

    private async getOneVacation(request: Request, response: Response): Promise<void> {
        const user = cyber.getUserFromRequestHeader(request.headers.authorization);
        const vacation = await vacationService.getOneVacation(request.params._id, user?._id);
        response.json(vacation);
    }

    private async addVacation(request: Request, response: Response): Promise<void> {
        const vacation = new VacationModel(request.body);
        vacation.image = getSingleUploadedFile(request.files?.image); // Mongoose ignores unknown keys passed to the constructor - assign directly.
        const dbVacation = await vacationService.addVacation(vacation);
        response.status(StatusCode.Created).json(dbVacation);
    }

    private async updateVacation(request: Request, response: Response): Promise<void> {
        request.body._id = request.params._id;
        const vacation = new VacationModel(request.body);
        vacation.image = getSingleUploadedFile(request.files?.image); // Mongoose ignores unknown keys passed to the constructor - assign directly.
        const dbVacation = await vacationService.updateVacation(vacation);
        response.status(StatusCode.OK).json(dbVacation);
    }

    private async deleteVacation(request: Request, response: Response): Promise<void> {
        await vacationService.deleteVacation(request.params._id);
        response.sendStatus(StatusCode.NoContent);
    }

    private getImage(request: Request, response: Response): void {
        const imageName = request.params.imageName.toString();
        const filePath = saver.getFilePath(imageName, true);
        response.sendFile(filePath);
    }

}

export const vacationController = new VacationController();
