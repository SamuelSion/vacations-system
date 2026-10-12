import { Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./not-found.css";

export function NotFound() {

    const navigate = useNavigate();

    return (
        <main className="NotFound">
            <Typography variant="h2" component="h1" className="not-found-code">
                404
            </Typography>
            <Typography variant="h5" component="p" className="not-found-message">
                Looks like this destination doesn't exist on our map.
            </Typography>
            <Button variant="contained" color="primary" onClick={() => navigate("/vacations")}>
                Back to Vacations
            </Button>
        </main>
    );
}
