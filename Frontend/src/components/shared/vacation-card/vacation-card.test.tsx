import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { VacationCard } from "./vacation-card";
import { sampleVacation } from "../../../utils/vacation-test-data";

describe("VacationCard", () => {

    afterEach(cleanup);

    it("should show the destination, dates and price", () => {
        render(<VacationCard vacation={sampleVacation} isAdmin={false} />);
        expect(screen.getByRole("heading", { name: "Paris, France" })).toBeInTheDocument();
        expect(screen.getByText("10/11/2026 - 20/11/2026")).toBeInTheDocument();
        expect(screen.getByText("$1450")).toBeInTheDocument();
    });

    it("should give the image a meaningful alt text", () => {
        render(<VacationCard vacation={sampleVacation} isAdmin={false} />);
        expect(screen.getByAltText("Paris, France vacation destination")).toBeInTheDocument();
    });

    it("should show a like button and no admin buttons to a regular user", () => {
        render(<VacationCard vacation={sampleVacation} isAdmin={false} />);
        expect(screen.getByRole("button", { name: "Like this vacation" })).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /edit/i })).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /delete/i })).not.toBeInTheDocument();
    });

    it("should offer to unlike a vacation that is already liked", () => {
        const likedVacation = { ...sampleVacation, likedByMe: true };
        render(<VacationCard vacation={likedVacation} isAdmin={false} />);
        expect(screen.getByRole("button", { name: "Unlike this vacation" })).toBeInTheDocument();
    });

    it("should show edit and delete buttons and no like button to an admin", () => {
        render(<VacationCard vacation={sampleVacation} isAdmin={true} />);
        expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /like this vacation/i })).not.toBeInTheDocument();
    });

    it("should call onToggleLike when the like button is clicked", () => {
        const onToggleLike = vi.fn();
        render(<VacationCard vacation={sampleVacation} isAdmin={false} onToggleLike={onToggleLike} />);
        fireEvent.click(screen.getByRole("button", { name: "Like this vacation" }));
        expect(onToggleLike).toHaveBeenCalledWith(sampleVacation);
    });

    it("should not open the details when the like button is clicked", () => {
        render(<VacationCard vacation={sampleVacation} isAdmin={false} onToggleLike={vi.fn()} />);
        fireEvent.click(screen.getByRole("button", { name: "Like this vacation" }));
        expect(screen.queryByText("Vacation Details")).not.toBeInTheDocument();
    });

    it("should open the read-only details when the card is clicked", () => {
        render(<VacationCard vacation={sampleVacation} isAdmin={false} />);
        fireEvent.click(screen.getByRole("heading", { name: "Paris, France" }));
        expect(screen.getByText("Vacation Details")).toBeInTheDocument();
        expect(screen.getByLabelText("Destination")).toHaveAttribute("readonly");
    });

    it("should call onEdit and onDelete for an admin", () => {
        const onEdit = vi.fn();
        const onDelete = vi.fn();
        render(<VacationCard vacation={sampleVacation} isAdmin={true} onEdit={onEdit} onDelete={onDelete} />);
        fireEvent.click(screen.getByRole("button", { name: /edit/i }));
        fireEvent.click(screen.getByRole("button", { name: /delete/i }));
        expect(onEdit).toHaveBeenCalledWith(sampleVacation);
        expect(onDelete).toHaveBeenCalledWith(sampleVacation);
    });

});
