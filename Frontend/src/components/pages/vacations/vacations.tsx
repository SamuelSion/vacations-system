import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { useIsUser } from "../../../hooks/use-is-user";
import { vacationService } from "../../../services/vacation-service";
import { likeService } from "../../../services/like-service";
import { notify } from "../../../utils/notify";
import { IVacation, VacationFilter } from "../../../models/vacation-model";
import { VacationCard } from "../../shared/vacation-card/vacation-card";
import { FilterBar } from "../../shared/filter-bar/filter-bar";
import { PaginationBar } from "../../shared/pagination-bar/pagination-bar";
import { Spinner } from "../../shared/spinner/spinner";
import "./vacations.css";

export function Vacations() {

    useIsUser();

    const [vacations, setVacations] = useState<IVacation[]>([]);
    const [filter, setFilter] = useState<VacationFilter>("all");
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshKey, setRefreshKey] = useState<number>(0);

    useEffect(() => {
        vacationService.getVacations(filter, page)
            .then(result => {
                setVacations(result.vacations);
                setTotalPages(result.totalPages);
            })
            .catch((err: unknown) => notify.error(err))
            .finally(() => setLoading(false));
    }, [filter, page, refreshKey]);

    function handleFilterChange(newFilter: VacationFilter) {
        setLoading(true);
        setFilter(newFilter);
        setPage(1);
    }

    function handlePageChange(newPage: number) {
        setLoading(true);
        setPage(newPage);
    }

    async function toggleLike(vacation: IVacation) {
        try {
            if (vacation.likedByMe) {
                await likeService.removeLike(vacation._id);
            }
            else {
                await likeService.addLike(vacation._id);
            }
            // Refresh silently (no spinner) so the grid stays mounted and the scroll position is kept.
            setRefreshKey(previousKey => previousKey + 1);
        }
        catch (err: unknown) {
            notify.error(err);
        }
    }

    return (
        <main className="page-container Vacations">
            <Typography variant="h4" component="h1" className="vacations-title">
                Explore Our Vacations
            </Typography>

            <FilterBar activeFilter={filter} onFilterChange={handleFilterChange} />

            {loading && <Spinner />}

            {!loading && vacations.length === 0 && (
                <div className="empty-state">
                    <Typography variant="h6">No vacations found for this filter.</Typography>
                </div>
            )}

            {!loading && vacations.length > 0 && (
                <div className="vacations-grid">
                    {vacations.map(vacation => (
                        <VacationCard
                            key={vacation._id}
                            vacation={vacation}
                            isAdmin={false}
                            onToggleLike={toggleLike}
                        />
                    ))}
                </div>
            )}

            <PaginationBar currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </main>
    );
}
