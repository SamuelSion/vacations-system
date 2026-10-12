import { Pagination } from "@mui/material";
import "./pagination-bar.css";

interface PaginationBarProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function PaginationBar(props: PaginationBarProps) {
    if (props.totalPages <= 1) return null;

    return (
        <div className="PaginationBar">
            <Pagination
                count={props.totalPages}
                page={props.currentPage}
                color="primary"
                onChange={(_event, page) => props.onPageChange(page)}
            />
        </div>
    );
}
