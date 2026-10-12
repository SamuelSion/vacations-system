import { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Typography, Paper } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useIsUser } from "../../../hooks/use-is-user";
import { aiService } from "../../../services/ai-service";
import { notify } from "../../../utils/notify";
import { Spinner } from "../../shared/spinner/spinner";
import "./mcp-chat.css";

interface QuestionFormData {
    question: string;
}

const EXAMPLE_QUESTIONS = [
    "How many active vacations are there right now?",
    "What is the average vacation price?",
    "What future vacations exist for European countries?"
];

export function McpChat() {

    useIsUser();

    const { register, handleSubmit, formState: { errors } } = useForm<QuestionFormData>();
    const [answer, setAnswer] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    async function send(formData: QuestionFormData) {
        try {
            setLoading(true);
            setAnswer("");
            const result = await aiService.askAboutVacations(formData.question);
            setAnswer(result);
        }
        catch (err: unknown) {
            notify.error(err);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <main className="page-container McpChat">
            <Typography variant="h4" component="h1" className="mcp-title">
                Ask Me Anything About Our Vacations
            </Typography>

            <Typography variant="body2" className="mcp-examples">
                Try asking: {EXAMPLE_QUESTIONS.join(" • ")}
            </Typography>

            <Paper className="mcp-form-card framed-card" elevation={3}>
                <form noValidate onSubmit={handleSubmit(send)} className="mcp-form">
                    <TextField
                        label="Your question"
                        placeholder="e.g. How many active vacations are there?"
                        fullWidth
                        multiline
                        rows={2}
                        {...register("question", { required: "Please enter a question.", minLength: { value: 3, message: "At least 3 characters." } })}
                        error={!!errors.question}
                        helperText={errors.question?.message}
                    />
                    <Button type="submit" variant="contained" color="primary" startIcon={<SendIcon />} className="send-button">
                        Ask
                    </Button>
                </form>
            </Paper>

            {loading && <Spinner />}

            {!loading && answer && (
                <Paper className="mcp-answer" elevation={2}>
                    <Typography variant="body1" className="mcp-answer-text">
                        {answer}
                    </Typography>
                </Paper>
            )}
        </main>
    );
}
