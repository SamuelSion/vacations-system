import { useEffect, useState } from "react";
import { Typography, Button } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../../hooks/use-admin";
import { vacationService } from "../../../services/vacation-service";
import { notify } from "../../../utils/notify";
import { IVacation } from "../../../models/vacation-model";
import { VacationCard } from "../../shared/vacation-card/vacation-card";
import { PaginationBar } from "../../shared/pagination-bar/pagination-bar";
import { Spinner } from "../../shared/spinner/spinner";
import "./admin-vacations.css";

export function AdminVacations() {

    useAdmin();
    const navigate = useNavigate();

    const [vacations, setVacations] = useState<IVacation[]>([]);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchVacations();
    }, [page]);

    async function fetchVacations() {
        try {
            setLoading(true);
            const result = await vacationService.getVacations("all", page);
            setVacations(result.vacations);
            setTotalPages(result.totalPages);
        }
        catch (err: unknown) {
            notify.error(err);
        }
        finally {
            setLoading(false);
        }
    }

    function goToEdit(vacation: IVacation) {
        navigate(`/admin/vacations/edit/${vacation._id}`);
    }

    async function deleteVacation(vacation: IVacation) {
        const isSure = confirm(`Are you sure you want to delete "${vacation.destination}"?`);
        if (!isSure) return;

        try {
            await vacationService.deleteVacation(vacation._id);
            notify.success("Vacation has been deleted.");
            await fetchVacations();
        }
        catch (err: unknown) {
            notify.error(err);
        }
    }

    return (
        <main className="page-container AdminVacations">
            <div className="admin-vacations-header">
                <Typography variant="h4" component="h1" className="admin-vacations-title">
                    Manage Vacations
                </Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<AddCircleIcon />}
                    onClick={() => navigate("/admin/vacations/add")}
                >
                    Add New Vacation
                </Button>
            </div>

            {loading && <Spinner />}

            {!loading && vacations.length === 0 && (
                <div className="empty-state">
                    <Typography variant="h6">No vacations yet - add the first one!</Typography>
                </div>
            )}

            {!loading && vacations.length > 0 && (
                <div className="vacations-grid">
                    {vacations.map(vacation => (
                        <VacationCard
                            key={vacation._id}
                            vacation={vacation}
                            isAdmin={true}
                            onEdit={goToEdit}
                            onDelete={deleteVacation}
                        />
                    ))}
                </div>
            )}

            <PaginationBar currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </main>
    );
}
