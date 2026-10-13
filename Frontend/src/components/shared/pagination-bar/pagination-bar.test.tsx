import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PaginationBar } from "./pagination-bar";

describe("PaginationBar", () => {

    afterEach(cleanup);

    it("should render nothing when there is only one page", () => {
        const { container } = render(<PaginationBar currentPage={1} totalPages={1} onPageChange={vi.fn()} />);
        expect(container).toBeEmptyDOMElement();
    });

    it("should render a button for every page", () => {
        render(<PaginationBar currentPage={1} totalPages={3} onPageChange={vi.fn()} />);
        expect(screen.getByRole("button", { name: /page 2/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /page 3/i })).toBeInTheDocument();
    });

    it("should report the chosen page", () => {
        const onPageChange = vi.fn();
        render(<PaginationBar currentPage={1} totalPages={3} onPageChange={onPageChange} />);
        fireEvent.click(screen.getByRole("button", { name: /page 2/i }));
        expect(onPageChange).toHaveBeenCalledWith(2);
    });

});
