import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { VacationDetailsDialog } from "./vacation-details-dialog";
import { sampleVacation } from "../../../utils/vacation-test-data";

describe("VacationDetailsDialog", () => {

    afterEach(cleanup);

    it("should render nothing when closed", () => {
        render(<VacationDetailsDialog vacation={sampleVacation} open={false} onClose={vi.fn()} />);
        expect(screen.queryByText("Vacation Details")).not.toBeInTheDocument();
    });

    it("should show all the vacation details when open", () => {
        render(<VacationDetailsDialog vacation={sampleVacation} open={true} onClose={vi.fn()} />);
        expect(screen.getByText("Vacation Details")).toBeInTheDocument();
        expect(screen.getByLabelText("Destination")).toHaveValue("Paris, France");
        expect(screen.getByLabelText("Description")).toHaveValue(sampleVacation.description);
        expect(screen.getByLabelText("Start Date")).toHaveValue("2026-11-10");
        expect(screen.getByLabelText("End Date")).toHaveValue("2026-11-20");
        expect(screen.getByLabelText("Price")).toHaveValue("$1450");
        expect(screen.getByText("3 likes")).toBeInTheDocument();
    });

    it("should not allow editing", () => {
        render(<VacationDetailsDialog vacation={sampleVacation} open={true} onClose={vi.fn()} />);
        expect(screen.getByLabelText("Destination")).toHaveAttribute("readonly");
        expect(screen.getByLabelText("Price")).toHaveAttribute("readonly");
    });

    it("should use the singular word for one like", () => {
        const singleLikeVacation = { ...sampleVacation, likesCount: 1 };
        render(<VacationDetailsDialog vacation={singleLikeVacation} open={true} onClose={vi.fn()} />);
        expect(screen.getByText("1 like")).toBeInTheDocument();
    });

    it("should call onClose when the close button is clicked", () => {
        const onClose = vi.fn();
        render(<VacationDetailsDialog vacation={sampleVacation} open={true} onClose={onClose} />);
        fireEvent.click(screen.getByRole("button", { name: /close/i }));
        expect(onClose).toHaveBeenCalledTimes(1);
    });

});
