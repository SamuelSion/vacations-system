import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Typography, Paper } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useAdmin } from "../../../hooks/use-admin";
import { vacationService } from "../../../services/vacation-service";
import { notify } from "../../../utils/notify";
import { IVacationFormData } from "../../../models/vacation-model";
import { Spinner } from "../../shared/spinner/spinner";
import "./edit-vacation.css";

export function EditVacation() {

    useAdmin();
    const navigate = useNavigate();
    const { _id } = useParams<{ _id: string }>();

    const { register, handleSubmit, getValues, reset, formState: { errors } } = useForm<IVacationFormData>();

    const [loading, setLoading] = useState<boolean>(true);
    const [currentImageUrl, setCurrentImageUrl] = useState<string>("");

    useEffect(() => {
        vacationService.getOneVacation(_id!)
            .then(vacation => {
                reset({
                    destination: vacation.destination,
                    description: vacation.description,
                    startDate: vacation.startDate.substring(0, 10),
                    endDate: vacation.endDate.substring(0, 10),
                    price: String(vacation.price)
                });
                setCurrentImageUrl(vacation.imageUrl);
            })
            .catch((err: unknown) => notify.error(err))
            .finally(() => setLoading(false));
    }, [_id, reset]);

    async function send(formData: IVacationFormData) {
        try {
            const fileList = formData.image as unknown as FileList;
            const image = fileList && fileList.length > 0 ? fileList[0] : null;
            const vacationToSend: IVacationFormData = { ...formData, image };
            await vacationService.updateVacation(_id!, vacationToSend);
            notify.success("Vacation has been updated.");
            navigate("/admin/vacations");
        }
        catch (err: unknown) {
            notify.error(err);
        }
    }

    if (loading) return <Spinner />;

    return (
        <main className="page-container">
            <Paper className="EditVacation" elevation={4}>
                <Typography variant="h4" component="h1" className="form-title">
                    Edit Vacation
                </Typography>

                {currentImageUrl && (
                    <img src={currentImageUrl} alt="Current vacation" className="current-image-preview" />
                )}

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
                        {...register("startDate", { required: "Start date is required." })}
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
                        Change Image (optional)
                        <input type="file" accept="image/*" hidden {...register("image")} />
                    </Button>

                    <Button type="submit" variant="contained" color="primary" fullWidth className="submit-button">
                        Save Changes
                    </Button>
                </form>
            </Paper>
        </main>
    );
}
