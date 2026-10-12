class AppConfig {

    public readonly apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string;
    public readonly vacationsPageSize = 9;

}

export const appConfig = new AppConfig();
