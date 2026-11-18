import { Header } from "./components/layout/header/header";
import { AppRouting } from "./routing/app-routing";

// The header is shown in every page, and below it the router shows the page of the current address:
export function App() {
    return (
        <div className="App">
            <Header />
            <AppRouting />
        </div>
    );
}
