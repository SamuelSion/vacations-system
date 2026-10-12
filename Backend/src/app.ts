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

    public async start(): Promise<void> {

        // Connect to MongoDB:
        await mongoose.connect(appConfig.mongodbConnectionString);
        console.log("Connected to MongoDB.");

        // Create our server object:
        const server = express();

        // Configure express to create request.body from a given JSON:
        server.use(express.json());

        // Allow the React client to call this API (both localhost and 127.0.0.1,
        // since browsers treat them as different origins):
        server.use(cors({
            origin: [appConfig.clientUrl, appConfig.clientUrl.replace("localhost", "127.0.0.1")]
        }));

        // Configure express to create request.files from uploaded files:
        server.use(expressFileUpload());

        // Healthcheck route (answers before any other logic, used by Docker):
        server.use("/ping", errorMiddleware.ping);

        // Register "before" middleware:
        server.use(loggerMiddleware.logToConsole);

        // Register controllers:
        server.use(authController.router);
        server.use(vacationController.router);
        server.use(likeController.router);
        server.use(reportController.router);
        server.use(aiController.router);

        // Register "after" middleware:
        server.use(errorMiddleware.routeNotFound);
        server.use(errorMiddleware.catchAll);

        // Run server:
        server.listen(appConfig.port, () => console.log(`Listening on port ${appConfig.port}...`));
    }

}

const app = new App();
app.start();
