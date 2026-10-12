import axios, { InternalAxiosRequestConfig } from "axios";

class Interceptor {

    public create(): void {

        // Registering a request interceptor:
        axios.interceptors.request.use((httpRequest: InternalAxiosRequestConfig) => {

            const token = localStorage.getItem("token");

            if (token) {
                httpRequest.headers.Authorization = "Bearer " + token;
            }

            return httpRequest;
        });
    }

}

export const interceptor = new Interceptor();
