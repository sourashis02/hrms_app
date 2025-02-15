import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import EmployeeCard from "../components/EmployeeCard";
import { API_URL } from "../App";
import useLoader from "../components/Loader";

const Employees = () => {
    const { loader, setIsLoading } = useLoader();
    const { auth } = useSelector(state => state.auth);
    const [employees, setEmployees] = useState([]);
    useEffect(() => {
        setIsLoading(true);
        fetch(`${API_URL}/api/allemployees`, {
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
            setEmployees(r.employees);
        }).catch(e => {
            alert(e.message);
        }).finally(() => {
            setIsLoading(false);
        })
    }, []);
    return (
        <>
            {loader}
            <div className="employees__container">
                <h2>Employees</h2>
                <div className="employees__section">
                    {employees.map(e => <EmployeeCard key={e._id} name={e.name} department={e.department} email={e.email} designation={e.designation} profileImageUrl={e.profileImageUrl} />)}
                </div>
            </div>
        </>
    );
}

export default Employees;