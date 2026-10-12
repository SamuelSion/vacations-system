import { createTheme } from "@mui/material";

// A warm, cheerful vacation palette: gold, green, yellow and turquoise.
export const appTheme = createTheme({
    typography: {
        fontFamily: "'Rubik', 'Segoe UI', sans-serif"
    },
    palette: {
        primary: {
            main: "#1FB6A6", // turquoise
            contrastText: "#ffffff"
        },
        secondary: {
            main: "#E3A008", // warm gold
            contrastText: "#ffffff"
        },
        success: {
            main: "#6FA83C" // warm green
        },
        warning: {
            main: "#F5B942" // soft yellow
        },
        background: {
            default: "#FFFBF2"
        }
    },
    shape: {
        borderRadius: 14
    }
});
