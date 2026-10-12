import { useForm } from "react-hook-form";
import { TextField, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../../hooks/use-admin";
import { vacationService } from "../../../services/vacation-service";
import { notify } from "../../../utils/notify";
import { IVacationFormData } from "../../../models/vacation-model";
import "./add-vacation.css";

function todayAsIsoDate(): string {
    return new Date().toISOString().substring(0, 10);
}

export function AddVacation() {

    useAdmin();
    const navigate = useNavigate();

    const { register, handleSubmit, getValues, formState: { errors } } = useForm<IVacationFormData>();

    async function send(formData: IVacationFormData) {
        try {
            const image = (formData.image as unknown as FileList)[0];
            const vacationToSend: IVacationFormData = { ...formData, image };
            await vacationService.addVacation(vacationToSend);
            notify.success("Vacation has been added.");
            navigate("/admin/vacations");
        }
        catch (err: unknown) {
            notify.error(err);
        }
    }

    return (
        <main className="page-container">
            <Paper className="AddVacation" elevation={4}>
                <Typography variant="h4" component="h1" className="form-title">
                    Add a New Vacation
                </Typography>

                <form noValidate onSubmit={handleSubmit(send)} className="vacation-form">
                    <TextField
                        label="Destination"
                        fullWidth
                        margin="normal"
                        {...register("destination", {
                            required: "Destination is required.",
                            minLength: { value: 2, message: "At least 2 characters." },
                            validate: value => /[a-zA-Z\u0590-\u05FF]/.test(value) || "Destination name cannot be only numbers."
                        })}
                        error={!!errors.destination}
                        helperText={errors.destination?.message}
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        multiline
                        rows={4}
                        margin="normal"
                        {...register("description", { required: "Description is required.", minLength: { value: 10, message: "At least 10 characters." } })}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                    />
                    <TextField
                        label="Start Date"
                        type="date"
                        fullWidth
                        margin="normal"
                        slotProps={{ inputLabel: { shrink: true } }}
                        {...register("startDate", {
                            required: "Start date is required.",
                            validate: value => value >= todayAsIsoDate() || "Start date cannot be in the past."
                        })}
                        error={!!errors.startDate}
                        helperText={errors.startDate?.message}
                    />
                    <TextField
                        label="End Date"
                        type="date"
                        fullWidth
                        margin="normal"
                        slotProps={{ inputLabel: { shrink: true } }}
                        {...register("endDate", {
                            required: "End date is required.",
                            validate: value => {
                                const startDate = getValues("startDate");
                                return !startDate || value >= startDate || "End date cannot be before start date.";
                            }
                        })}
                        error={!!errors.endDate}
                        helperText={errors.endDate?.message}
                    />
                    <TextField
                        label="Price"
                        type="number"
                        fullWidth
                        margin="normal"
                        slotProps={{ htmlInput: { step: "0.01" } }}
                        {...register("price", {
                            required: "Price is required.",
                            min: { value: 0, message: "Price cannot be negative." },
                            max: { value: 10000, message: "Price cannot exceed 10,000." }
                        })}
                        error={!!errors.price}
                        helperText={errors.price?.message}
                    />

                    <Button variant="outlined" component="label" className="upload-button">
                        Upload Image
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            {...register("image", { required: "An image is required." })}
                        />
                    </Button>
                    {errors.image && <Typography color="error" variant="body2">{errors.image.message}</Typography>}

                    <Button type="submit" variant="contained" color="primary" fullWidth className="submit-button">
                        Add Vacation
                    </Button>
                </form>
            </Paper>
        </main>
    );
}
