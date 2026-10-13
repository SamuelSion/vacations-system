import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FilterBar } from "./filter-bar";

describe("FilterBar", () => {

    afterEach(cleanup);

    it("should render all four filters", () => {
        render(<FilterBar activeFilter="all" onFilterChange={vi.fn()} />);
        expect(screen.getByRole("button", { name: /all vacations/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /liked by me/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /currently active/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /not started yet/i })).toBeInTheDocument();
    });

    it("should mark only the active filter", () => {
        render(<FilterBar activeFilter="liked" onFilterChange={vi.fn()} />);
        expect(screen.getByRole("button", { name: /liked by me/i })).toHaveClass("active");
        expect(screen.getByRole("button", { name: /all vacations/i })).not.toHaveClass("active");
    });

    it("should report the chosen filter", () => {
        const onFilterChange = vi.fn();
        render(<FilterBar activeFilter="all" onFilterChange={onFilterChange} />);
        fireEvent.click(screen.getByRole("button", { name: /not started yet/i }));
        expect(onFilterChange).toHaveBeenCalledWith("notStarted");
    });

});
