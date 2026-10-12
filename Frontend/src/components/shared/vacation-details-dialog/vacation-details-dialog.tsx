import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography } from "@mui/material";
import { IVacation } from "../../../models/vacation-model";
import "./vacation-details-dialog.css";

interface VacationDetailsDialogProps {
    vacation: IVacation;
    open: boolean;
    onClose: () => void;
}

// Read-only view of all the vacation details - same layout as the Edit Vacation page, without editing:
export function VacationDetailsDialog(props: VacationDetailsDialogProps) {
    const vacation = props.vacation;

    return (
        <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="sm" className="VacationDetailsDialog">
            <DialogTitle className="details-title">Vacation Details</DialogTitle>

            <DialogContent>
                <img
                    src={vacation.imageUrl}
                    alt={`${vacation.destination} vacation destination`}
                    className="details-image"
                />
                <Typography variant="body2" className="details-likes">
                    {vacation.likesCount} {vacation.likesCount === 1 ? "like" : "likes"}
                </Typography>

                <TextField
                    label="Destination"
                    value={vacation.destination}
                    fullWidth
                    margin="normal"
                    className="details-field"
                    slotProps={{ input: { readOnly: true } }}
                />
                <TextField
                    label="Description"
                    value={vacation.description}
                    fullWidth
                    multiline
                    margin="normal"
                    className="details-field"
                    slotProps={{ input: { readOnly: true } }}
                />
                <TextField
                    label="Start Date"
                    type="date"
                    value={vacation.startDate.substring(0, 10)}
                    fullWidth
                    margin="normal"
                    className="details-field"
                    slotProps={{ inputLabel: { shrink: true }, input: { readOnly: true } }}
                />
                <TextField
                    label="End Date"
                    type="date"
                    value={vacation.endDate.substring(0, 10)}
                    fullWidth
                    margin="normal"
                    className="details-field"
                    slotProps={{ inputLabel: { shrink: true }, input: { readOnly: true } }}
                />
                <TextField
                    label="Price"
                    value={`$${vacation.price}`}
                    fullWidth
                    margin="normal"
                    className="details-field"
                    slotProps={{ input: { readOnly: true } }}
                />
            </DialogContent>

            <DialogActions>
                <Button variant="contained" color="primary" onClick={props.onClose}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}
