import { useForm } from "react-hook-form";
import { TextField, Button, Typography, Paper } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { IRegisterData } from "../../../models/user-model";
import { userService } from "../../../services/user-service";
import { notify } from "../../../utils/notify";
import "./register.css";

export function Register() {

    const { register, handleSubmit, formState: { errors } } = useForm<IRegisterData>();
    const navigate = useNavigate();

    async function send(user: IRegisterData) {
        try {
            await userService.register(user);
            notify.success("Welcome! Your account has been created.");
            navigate("/vacations");
        }
        catch (err: unknown) {
            notify.error(err);
        }
    }

    return (
        <main className="centered-form-page">
            <Paper className="Register framed-card" elevation={4}>
                <Typography variant="h4" component="h1" className="form-title">
                    Create Your Account
                </Typography>

                <form noValidate onSubmit={handleSubmit(send)} className="register-form">
                    <TextField
                        label="First Name"
                        fullWidth
                        margin="normal"
                        {...register("firstName", { required: "First name is required.", minLength: { value: 2, message: "At least 2 characters." } })}
                        error={!!errors.firstName}
                        helperText={errors.firstName?.message}
                    />
                    <TextField
                        label="Last Name"
                        fullWidth
                        margin="normal"
                        {...register("lastName", { required: "Last name is required.", minLength: { value: 2, message: "At least 2 characters." } })}
                        error={!!errors.lastName}
                        helperText={errors.lastName?.message}
                    />
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
                        Register
                    </Button>

                    <Typography variant="body2" className="switch-link-text">
                        Already a member? <Link to="/login" className="switch-link">Login</Link>
                    </Typography>
                </form>
            </Paper>
        </main>
    );
}
