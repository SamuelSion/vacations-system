import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IUser } from "../models/user-model";
import { AppState } from "../redux/app-state";

// Custom hook for checking if user is signed in - redirects to /login if not:
export function useIsUser(): void {

    const user = useSelector<AppState, IUser>(state => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, []);
}
