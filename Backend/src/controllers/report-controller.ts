import express, { Request, Response, Router } from "express";
import { vacationService } from "../services/vacation-service";
import { securityMiddleware } from "../middleware/security-middleware";
import { asyncHandler } from "../utils/async-handler";

// The likes report - for admins only.
class ReportController {

    public router: Router = express.Router();

    public constructor() {
        this.router.get("/api/reports/likes", securityMiddleware.verifyAdmin, asyncHandler.wrap(this.getLikesReport));
        this.router.get("/api/reports/likes/csv", securityMiddleware.verifyAdmin, asyncHandler.wrap(this.getLikesCsv));
    }

    private async getLikesReport(request: Request, response: Response): Promise<void> {
        const report = await vacationService.getLikesReport();
        response.json(report);
    }

    // The same report as a downloadable CSV file:
    private async getLikesCsv(request: Request, response: Response): Promise<void> {
        const report = await vacationService.getLikesReport();

        const rows = ["Destination,Likes"];
        for (const row of report) {
            // A destination that contains a comma must be quoted, otherwise it would split into two CSV columns:
            const safeDestination = row.destination.includes(",") ? `"${row.destination}"` : row.destination;
            rows.push(`${safeDestination},${row.likes}`);
        }
        const csv = rows.join("\n");

        response.setHeader("Content-Type", "text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=vacation-likes.csv");
        response.send(csv);
    }

}

export const reportController = new ReportController();
