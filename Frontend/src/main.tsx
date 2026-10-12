import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "@emotion/react";
import "./index.css";
import { App } from "./app";
import { store } from "./redux/store";
import { appTheme } from "./theme/app-theme";
import { interceptor } from "./utils/interceptor";

// Create the axios interceptor once, before the app renders:
interceptor.create();

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider theme={appTheme}>
            <BrowserRouter>
                <Provider store={store}>
                    <App />
                </Provider>
            </BrowserRouter>
        </ThemeProvider>
    </StrictMode>
);
