import dotenv from "dotenv";
dotenv.config();

class AppConfig {

    public readonly port = process.env.PORT || 4000;
    public readonly mongodbConnectionString = process.env.MONGODB_CONNECTION_STRING!;
    public readonly jwtSecret = process.env.JWT_SECRET!;
    public readonly hashSalt = process.env.HASH_SALT!;
    // Placeholder when no key is set, so the server still starts and only the AI pages report an error:
    public readonly openaiApiKey = process.env.OPENAI_API_KEY || "missing-openai-api-key";
    public readonly vacationImagesBaseUrl = process.env.VACATION_IMAGES_BASE_URL!;
    public readonly clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

}

export const appConfig = new AppConfig();
