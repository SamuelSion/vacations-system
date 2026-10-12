import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IUser } from "../../../models/user-model";
import { AppState } from "../../../redux/app-state";
import { Role } from "../../../models/role";
import { userService } from "../../../services/user-service";
import { notify } from "../../../utils/notify";
import { SunIcon } from "../sun-icon/sun-icon";
import "./header.css";

// react-router's NavLink only adds the "active" class automatically when
// className is a function - a plain string disables that behavior entirely.
function navLinkClassName({ isActive }: { isActive: boolean }): string {
    return isActive ? "header-link active" : "header-link";
}

export function Header() {

    const user = useSelector<AppState, IUser>(state => state.user);
    const navigate = useNavigate();

    function signOut(): void {
        userService.logout();
        notify.success("You have been signed out.");
        navigate("/login");
    }

    return (
        <AppBar position="static" color="inherit" elevation={0} className="Header">
            <Toolbar className="header-toolbar">
                <div className="header-brand">
                    <SunIcon />
                    <Typography variant="h5" component="div" className="header-title">
                        Vacations
                    </Typography>
                </div>

                <nav className="header-nav">
                    {!user && (
                        <>
                            <NavLink to="/register" className={navLinkClassName}>Register</NavLink>
                            <NavLink to="/login" className={navLinkClassName}>Login</NavLink>
                        </>
                    )}

                    {user && user.roleId === Role.User && (
                        <>
                            <NavLink to="/vacations" end className={navLinkClassName}>Vacations</NavLink>
                            <NavLink to="/ai-recommendation" className={navLinkClassName}>AI Recommendation</NavLink>
                            <NavLink to="/ask-mcp" className={navLinkClassName}>Ask About Vacations</NavLink>
                        </>
                    )}

                    {user && user.roleId === Role.Admin && (
                        <>
                            <NavLink to="/admin/vacations" end className={navLinkClassName}>Vacations</NavLink>
                            <NavLink to="/admin/vacations/add" className={navLinkClassName}>Add Vacation</NavLink>
                            <NavLink to="/admin/report" className={navLinkClassName}>Report</NavLink>
                        </>
                    )}

                    {user && (
                        <>
                            <span className="header-username">Hi, {user.firstName} {user.lastName}</span>
                            <Button color="primary" variant="outlined" size="small" onClick={signOut}>
                                Sign Out
                            </Button>
                        </>
                    )}
                </nav>
            </Toolbar>
        </AppBar>
    );
}
