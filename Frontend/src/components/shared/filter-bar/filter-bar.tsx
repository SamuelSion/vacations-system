import { Box, Button } from "@mui/material";
import { VacationFilter } from "../../../models/vacation-model";
import "./filter-bar.css";

interface FilterBarProps {
    activeFilter: VacationFilter;
    onFilterChange: (filter: VacationFilter) => void;
}

const FILTERS: { value: VacationFilter; label: string }[] = [
    { value: "all", label: "All Vacations" },
    { value: "liked", label: "Liked by Me" },
    { value: "active", label: "Currently Active" },
    { value: "notStarted", label: "Not Started Yet" }
];

export function FilterBar(props: FilterBarProps) {
    return (
        <Box className="FilterBar">
            {FILTERS.map(filter => (
                <Button
                    variant="outlined"
                    key={filter.value}
                    className={props.activeFilter === filter.value ? "filter-button active" : "filter-button"}
                    onClick={() => props.onFilterChange(filter.value)}
                >
                    {filter.label}
                </Button>
            ))}
        </Box>
    );
}
