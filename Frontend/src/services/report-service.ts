import axios from "axios";
import { appConfig } from "../utils/app-config";

export interface ILikesReportRow {
    destination: string;
    likes: number;
}

class ReportService {

    public async getLikesReport(): Promise<ILikesReportRow[]> {
        const url = `${appConfig.apiBaseUrl}/api/reports/likes`;
        const response = await axios.get<ILikesReportRow[]>(url);
        return response.data;
    }

    // Downloads the CSV file directly through the browser:
    public async downloadLikesCsv(): Promise<void> {
        const url = `${appConfig.apiBaseUrl}/api/reports/likes/csv`;
        const response = await axios.get(url, { responseType: "blob" });

        const blobUrl = window.URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = "vacation-likes.csv";
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(blobUrl);
    }

}

export const reportService = new ReportService();
