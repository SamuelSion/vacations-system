import { Card, CardMedia, CardContent, Typography, IconButton, Button } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IVacation } from "../../../models/vacation-model";
import "./vacation-card.css";

interface VacationCardProps {
    vacation: IVacation;
    isAdmin: boolean;
    onToggleLike?: (vacation: IVacation) => void;
    onEdit?: (vacation: IVacation) => void;
    onDelete?: (vacation: IVacation) => void;
}

function formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-GB");
}

export function VacationCard(props: VacationCardProps) {
    const vacation = props.vacation;

    return (
        <Card className="VacationCard">
            <CardMedia
                component="img"
                image={vacation.imageUrl}
                alt={`${vacation.destination} vacation destination`}
                className="vacation-card-image"
            />

            {!props.isAdmin && (
                <IconButton
                    className="like-button"
                    onClick={() => props.onToggleLike?.(vacation)}
                    aria-label={vacation.likedByMe ? "Unlike this vacation" : "Like this vacation"}
                >
                    {vacation.likedByMe ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                    <span className="like-count">{vacation.likesCount}</span>
                </IconButton>
            )}

            <CardContent className="vacation-card-content">
                <Typography variant="h6" component="h2" className="vacation-destination">
                    {vacation.destination}
                </Typography>
                <Typography variant="body2" className="vacation-dates">
                    {formatDate(vacation.startDate)} - {formatDate(vacation.endDate)}
                </Typography>
                <Typography variant="body2" className="vacation-description">
                    {vacation.description}
                </Typography>
                <div className="vacation-price-row">
                    <Typography variant="h6" className="vacation-price">
                        ${vacation.price}
                    </Typography>
                    <span className="corner-ornament" aria-hidden="true"></span>
                </div>

                {props.isAdmin && (
                    <div className="admin-actions">
                        <Button
                            startIcon={<EditIcon />}
                            variant="outlined"
                            color="primary"
                            size="small"
                            onClick={() => props.onEdit?.(vacation)}
                        >
                            Edit
                        </Button>
                        <Button
                            startIcon={<DeleteIcon />}
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => props.onDelete?.(vacation)}
                        >
                            Delete
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
