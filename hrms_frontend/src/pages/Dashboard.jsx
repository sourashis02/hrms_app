import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { API_URL } from "../App";
import { setUser, updateCheckIn, updateCheckOut } from "../redux/userSlice";
import useLoader from "../components/Loader";


const Dashboard = () => {
    const dispatch = useDispatch();
    const { auth } = useSelector(state => state.auth);
    const { user } = useSelector(state => state.user);
    const { loader, setIsLoading } = useLoader();
    useEffect(() => {
        setIsLoading(true);
        fetch(`${API_URL}/api/userinfo`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth.token}`
            },
        }).then(async (res) => {
            if (!res.ok) {
                throw new Error(await res.text());
            }
            return res.json();
        }).then(r => {
            console.log(r);
            localStorage.setItem("user", JSON.stringify(r));
            dispatch(setUser(r));
        }).catch(e => {
            alert(e.message);
        }).finally(() => {
            setIsLoading(false);
        })
    }, []);

    const handleCheckIn = () => {
        setIsLoading(true);
        fetch(`${API_URL}/api/checkin`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth.token}`
            },
        }).then(async (res) => {
            if (!res.ok) {
                throw new Error(await res.text());
            }
            return res.json();
        }).then(() => {
            dispatch(updateCheckIn());
        }).catch(e => {
            alert(e.message);
        }).finally(() => {
            setIsLoading(false);
        })
    }

    const handleCheckOut = () => {
        if (!confirm("Are you sure you want to checkout?")) {
            return;
        }
        setIsLoading(true);
        fetch(`${API_URL}/api/checkout`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth.token}`
            },
        }).then(async (res) => {
            if (!res.ok) {
                throw new Error(await res.text());
            }
            return res.json();
        }).then(() => {
            dispatch(updateCheckOut());
        }).catch(e => {
            alert(e.message);
        }).finally(() => {
            setIsLoading(false);
        })
    }

    return (
        <>
            {loader}
            <div className="main__container">
                <div className="statsContainer">
                    <div className="statCard">
                        <h3>Total Employees</h3>
                        <p>{user?.totalEmployees}</p>
                    </div>
                    <div className="statCard">
                        <h3>On Leave</h3>
                        <p>{user?.totalEmployeesLeave}</p>
                    </div>
                    <div className="statCard">
                        <h3>Present Today</h3>
                        <p>{user?.totalEmployeesPresent}</p>
                    </div>
                </div>
                <div className="employee__data_section">
                    <div className="todays__attendance">
                        <h3>Today's Attendance</h3>
                        <div className="action">
                            <button className={"checkin " + (user?.checkedIn ? "disabled" : "")} onClick={handleCheckIn} disabled={user?.checkedIn}>
                                Check-In
                            </button>
                            <button className={"checkout " + (user?.checkedOut ? "disabled" : "")} onClick={handleCheckOut} disabled={user?.checkedOut}>
                                Check-Out
                            </button>
                        </div>
                    </div>
                    <div className="payroll__container">
                        <h3>Payroll</h3>
                        <p>Salary Payable: ${user?.salaryPayable}</p>
                        <p>Leaves taken: {user?.leavesTakenThisMonth}</p>
                        <p>Base Salary: ${user?.baseSalary}</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;