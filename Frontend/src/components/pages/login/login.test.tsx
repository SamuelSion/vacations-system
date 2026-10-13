import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { Login } from "./login";

function renderLogin() {
    render(
        <MemoryRouter>
            <Login />
        </MemoryRouter>
    );
}

describe("Login", () => {

    afterEach(cleanup);

    it("should have a single h1 title", () => {
        renderLogin();
        expect(screen.getByRole("heading", { level: 1, name: "Welcome Back" })).toBeInTheDocument();
    });

    it("should render email and password fields", () => {
        renderLogin();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it("should show required errors when submitting an empty form", async () => {
        renderLogin();
        fireEvent.click(screen.getByRole("button", { name: "Login" }));
        expect(await screen.findByText("Email is required.")).toBeInTheDocument();
        expect(await screen.findByText("Password is required.")).toBeInTheDocument();
    });

    it("should show an error for an invalid email", async () => {
        renderLogin();
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "not-an-email" } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "1234" } });
        fireEvent.click(screen.getByRole("button", { name: "Login" }));
        expect(await screen.findByText("Please enter a valid email.")).toBeInTheDocument();
    });

    it("should link to the register page", () => {
        renderLogin();
        expect(screen.getByRole("link", { name: "Create an account" })).toHaveAttribute("href", "/register");
    });

});
