import { NavLink } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import { useSelector, useDispatch } from "react-redux";
import { API_URL } from "../App";
import { setAuth } from "../redux/authSlice";
import { setUser } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
    const { user } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(setAuth(null));
        dispatch(setUser(null));
        localStorage.removeItem("user");
        localStorage.removeItem("authData");
        setTimeout(() => {
            navigate("/login");
        }, 1000)
    }
    return (
        <div className="sidebar">
            <div className="logo">HRMS System</div>
            <nav className="navMenu">
                <NavLink to="/" className={({ isActive }) => isActive ? "menuItem active" : "menuItem"}>Dashboard</NavLink>
                <NavLink to="/employees" className={({ isActive }) => isActive ? "menuItem active" : "menuItem"}>Employees</NavLink>
                {user?.isAdmin && <NavLink to="/createemployee" className={({ isActive }) => isActive ? "menuItem active" : "menuItem"}>Create Employee</NavLink>}
                <NavLink to="/leaves" className={({ isActive }) => isActive ? "menuItem active" : "menuItem"}>Leaves</NavLink>
                {user?.isAdmin && <NavLink to="/leaverequest" className={({ isActive }) => isActive ? "menuItem active" : "menuItem"}>Leave Request</NavLink>}
            </nav>
            <div className="user__info">
                <img className="user__img" src={`${API_URL}${user?.profileImageUrl}`} alt="user" />
                <p className="name">{user?.name}</p>
                <span onClick={handleLogout}><LogoutIcon /></span>
            </div>
        </div>
    );
}

export default Sidebar;