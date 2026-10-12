import { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Typography, Paper } from "@mui/material";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import { useIsUser } from "../../../hooks/use-is-user";
import { aiService } from "../../../services/ai-service";
import { notify } from "../../../utils/notify";
import { Spinner } from "../../shared/spinner/spinner";
import "./ai-recommendation.css";

interface DestinationFormData {
    destination: string;
}

export function AiRecommendation() {

    useIsUser();

    const { register, handleSubmit, formState: { errors } } = useForm<DestinationFormData>();
    const [recommendation, setRecommendation] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    async function send(formData: DestinationFormData) {
        try {
            setLoading(true);
            setRecommendation("");
            const result = await aiService.getRecommendation(formData.destination);
            setRecommendation(result);
        }
        catch (err: unknown) {
            notify.error(err);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <main className="page-container AiRecommendation">
            <Typography variant="h4" component="h1" className="ai-title">
                AI Vacation Recommendation
            </Typography>

            <Paper className="ai-form-card framed-card" elevation={3}>
                <form noValidate onSubmit={handleSubmit(send)} className="ai-form">
                    <TextField
                        label="Destination"
                        placeholder="e.g. Santorini"
                        fullWidth
                        {...register("destination", { required: "Please enter a destination.", minLength: { value: 2, message: "At least 2 characters." } })}
                        error={!!errors.destination}
                        helperText={errors.destination?.message}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        startIcon={<TravelExploreIcon />}
                        className="ask-button"
                    >
                        Get Recommendation
                    </Button>
                </form>
            </Paper>

            {loading && <Spinner />}

            {!loading && recommendation && (
                <Paper className="recommendation-result" elevation={2}>
                    <Typography variant="body1" className="recommendation-text">
                        {recommendation}
                    </Typography>
                </Paper>
            )}
        </main>
    );
}
