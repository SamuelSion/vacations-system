import { Box, Button } from "@mui/material";
import { VacationFilter } from "../../../models/vacation-model";
import "./filter-bar.css";

interface FilterBarProps {
    activeFilter: VacationFilter;
    onFilterChange: (filter: VacationFilter) => void;
}

// The filter buttons, in the order they are shown:
const filterOptions: { value: VacationFilter; label: string }[] = [
    { value: "all", label: "All Vacations" },
    { value: "liked", label: "Liked by Me" },
    { value: "active", label: "Currently Active" },
    { value: "notStarted", label: "Not Started Yet" }
];

// One filter is always active, and a click on another button replaces it (the filters are not combined):
export function FilterBar(props: FilterBarProps) {
    return (
        <Box className="FilterBar">
            {filterOptions.map(filter => (
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
