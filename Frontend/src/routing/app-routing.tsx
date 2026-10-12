import { Suspense, lazy } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Spinner } from "../components/shared/spinner/spinner";

// Each page is loaded only when its route is visited (code splitting):
const Register = lazy(() => import("../components/pages/register/register").then(module => ({ default: module.Register })));
const Login = lazy(() => import("../components/pages/login/login").then(module => ({ default: module.Login })));
const Vacations = lazy(() => import("../components/pages/vacations/vacations").then(module => ({ default: module.Vacations })));
const AdminVacations = lazy(() => import("../components/pages/admin-vacations/admin-vacations").then(module => ({ default: module.AdminVacations })));
const AddVacation = lazy(() => import("../components/pages/add-vacation/add-vacation").then(module => ({ default: module.AddVacation })));
const EditVacation = lazy(() => import("../components/pages/edit-vacation/edit-vacation").then(module => ({ default: module.EditVacation })));
const Report = lazy(() => import("../components/pages/report/report").then(module => ({ default: module.Report })));
const AiRecommendation = lazy(() => import("../components/pages/ai-recommendation/ai-recommendation").then(module => ({ default: module.AiRecommendation })));
const McpChat = lazy(() => import("../components/pages/mcp-chat/mcp-chat").then(module => ({ default: module.McpChat })));
const NotFound = lazy(() => import("../components/shared/not-found/not-found").then(module => ({ default: module.NotFound })));

export function AppRouting() {
    return (
        <Suspense fallback={<Spinner />}>
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
        </Suspense>
    );
}
