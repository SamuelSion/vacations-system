import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IUser } from "../models/user-model";
import { AppState } from "../redux/app-state";
import { Role } from "../models/role";

// Custom hook for pages that are only for regular users - guests go to /login, admins go to their own page:
export function useIsUser(): void {

    const user = useSelector<AppState, IUser>(state => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
        else if (user.roleId === Role.Admin) {
            navigate("/admin/vacations");
        }
    }, [user, navigate]);
}
