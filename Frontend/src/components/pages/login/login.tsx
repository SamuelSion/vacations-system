import { useForm } from "react-hook-form";
import { TextField, Button, Typography, Paper } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { ICredentials } from "../../../models/user-model";
import { userService } from "../../../services/user-service";
import { notify } from "../../../utils/notify";
import "./login.css";

export function Login() {

    const { register, handleSubmit, formState: { errors } } = useForm<ICredentials>();
    const navigate = useNavigate();

    async function send(credentials: ICredentials) {
        try {
            await userService.login(credentials);
            notify.success("Welcome back!");
            navigate("/vacations");
        }
        catch (err: unknown) {
            notify.error(err);
        }
    }

    return (
        <main className="centered-form-page">
            <Paper className="Login framed-card" elevation={4}>
                <Typography variant="h4" component="h1" className="form-title">
                    Welcome Back
                </Typography>

                <form noValidate onSubmit={handleSubmit(send)} className="login-form">
                    <TextField
                        label="Email"
                        fullWidth
                        margin="normal"
                        {...register("email", {
                            required: "Email is required.",
                            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Please enter a valid email." }
                        })}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        {...register("password", { required: "Password is required.", minLength: { value: 4, message: "At least 4 characters." } })}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />

                    <Button type="submit" variant="contained" color="primary" fullWidth className="submit-button">
                        Login
                    </Button>

                    <Typography variant="body2" className="switch-link-text">
                        New here? <Link to="/register" className="switch-link">Create an account</Link>
                    </Typography>
                </form>
            </Paper>
        </main>
    );
}
