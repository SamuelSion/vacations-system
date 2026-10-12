import { Header } from "./components/layout/header/header";
import { AppRouting } from "./routing/app-routing";

export function App() {
    return (
        <div className="App">
            <Header />
            <AppRouting />
        </div>
    );
}
