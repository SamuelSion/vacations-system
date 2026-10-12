import { Route, Routes } from "react-router-dom";
import { Register } from "../components/pages/register/register";
import { Login } from "../components/pages/login/login";
import { Vacations } from "../components/pages/vacations/vacations";
import { AdminVacations } from "../components/pages/admin-vacations/admin-vacations";
import { AddVacation } from "../components/pages/add-vacation/add-vacation";
import { EditVacation } from "../components/pages/edit-vacation/edit-vacation";
import { Report } from "../components/pages/report/report";
import { AiRecommendation } from "../components/pages/ai-recommendation/ai-recommendation";
import { McpChat } from "../components/pages/mcp-chat/mcp-chat";
import { NotFound } from "../components/shared/not-found/not-found";
import { Navigate } from "react-router-dom";

export function AppRouting() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/vacations" />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/vacations" element={<Vacations />} />
            <Route path="/ai-recommendation" element={<AiRecommendation />} />
            <Route path="/ask-mcp" element={<McpChat />} />
            <Route path="/admin/vacations" element={<AdminVacations />} />
            <Route path="/admin/vacations/add" element={<AddVacation />} />
            <Route path="/admin/vacations/edit/:_id" element={<EditVacation />} />
            <Route path="/admin/report" element={<Report />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
