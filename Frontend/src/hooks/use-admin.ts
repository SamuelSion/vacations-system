import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IUser } from "../models/user-model";
import { AppState } from "../redux/app-state";
import { Role } from "../models/role";
import { notify } from "../utils/notify";

// Custom hook for checking if user is an Admin - redirects away if not:
export function useAdmin(): void {

    const user = useSelector<AppState, IUser>(state => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
        else if (user.roleId !== Role.Admin) {
            notify.error("You are not authorized to view this page.");
            navigate("/vacations");
        }
    }, [user, navigate]);
}
