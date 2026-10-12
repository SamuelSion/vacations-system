import { useEffect, useState } from "react";
import { Typography, Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useAdmin } from "../../../hooks/use-admin";
import { reportService, ILikesReportRow } from "../../../services/report-service";
import { notify } from "../../../utils/notify";
import { Spinner } from "../../shared/spinner/spinner";
import "./report.css";

export function Report() {

    useAdmin();

    const [report, setReport] = useState<ILikesReportRow[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        reportService.getLikesReport()
            .then(data => setReport(data))
            .catch((err: unknown) => notify.error(err))
            .finally(() => setLoading(false));
    }, []);

    async function downloadCsv() {
        try {
            await reportService.downloadLikesCsv();
        }
        catch (err: unknown) {
            notify.error(err);
        }
    }

    return (
        <main className="page-container Report">
            <div className="report-header">
                <Typography variant="h4" component="h1" className="report-title">
                    Vacations Report
                </Typography>
                <Button variant="contained" color="secondary" startIcon={<DownloadIcon />} onClick={downloadCsv}>
                    Download CSV
                </Button>
            </div>

            {loading && <Spinner />}

            {!loading && (
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height={420}>
                        <BarChart data={report} margin={{ top: 20, right: 20, bottom: 60, left: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="destination" angle={-35} textAnchor="end" interval={0} height={90} />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="likes" fill="#1fb6a6" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </main>
    );
}
