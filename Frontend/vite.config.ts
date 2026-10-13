import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config"; // Instead of "vite" to support testing

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        open: true
    },
    test: {
        environment: "jsdom"
    }
});
