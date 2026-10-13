import express from "express";
import cors from "cors";
import expressFileUpload from "express-fileupload";
import mongoose from "mongoose";
import { appConfig } from "./utils/app-config";
import { loggerMiddleware } from "./middleware/logger-middleware";
import { errorMiddleware } from "./middleware/error-middleware";
import { authController } from "./controllers/auth-controller";
import { vacationController } from "./controllers/vacation-controller";
import { likeController } from "./controllers/like-controller";
import { reportController } from "./controllers/report-controller";
import { aiController } from "./controllers/ai-controller";

class App {

    // Exposed so integration tests can send requests to it with supertest:
    public readonly server = express();

    public async start(): Promise<void> {

        // Connect to MongoDB:
        await mongoose.connect(appConfig.mongodbConnectionString);
        console.log("Connected to MongoDB.");

        // Configure express to create request.body from a given JSON:
        this.server.use(express.json());

        // Allow the React client to call this API (both localhost and 127.0.0.1,
        // since browsers treat them as different origins):
        this.server.use(cors({
            origin: [appConfig.clientUrl, appConfig.clientUrl.replace("localhost", "127.0.0.1")]
        }));

        // Configure express to create request.files from uploaded files:
        this.server.use(expressFileUpload());

        // Healthcheck route (answers before any other logic, used by Docker):
        this.server.use("/ping", errorMiddleware.ping);

        // Register "before" middleware:
        this.server.use(loggerMiddleware.logToConsole);

        // Register controllers:
        this.server.use(authController.router);
        this.server.use(vacationController.router);
        this.server.use(likeController.router);
        this.server.use(reportController.router);
        this.server.use(aiController.router);

        // Register "after" middleware:
        this.server.use(errorMiddleware.routeNotFound);
        this.server.use(errorMiddleware.catchAll);

        // Run server:
        this.server.listen(appConfig.port, () => console.log(`Listening on port ${appConfig.port}...`));
    }

}

export const app = new App();
export const serverReady = app.start();
