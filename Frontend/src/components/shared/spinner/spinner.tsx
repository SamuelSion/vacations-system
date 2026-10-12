import { CircularProgress } from "@mui/material";
import "./spinner.css";

export function Spinner() {
    return (
        <div className="Spinner">
            <CircularProgress color="secondary" />
        </div>
    );
}
