import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const PageLayout = () => {
    return (
        <>
            <div className="appContainer">
                <Sidebar />
                <Outlet />
            </div>
        </>
    )
}

export default PageLayout;