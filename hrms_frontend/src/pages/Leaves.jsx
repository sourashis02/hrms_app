import { useEffect, useState } from "react";
import { API_URL } from "../App";
import useLoader from "../components/Loader";
import { useSelector, useDispatch } from "react-redux";
import { setLeave, addLeave } from "../redux/leaveSlice";

const Leaves = () => {
    const { auth } = useSelector(state => state.auth);
    const { leaves } = useSelector(state => state.leave);
    const dispatch = useDispatch();
    const { loader, setIsLoading } = useLoader();
    const [leaveData, setLeaveData] = useState({});
    useEffect(() => {
        setIsLoading(true);
        fetch(`${API_URL}/api/leavedata`, {
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
            dispatch(setLeave(r.leaves));
        }).catch(e => {
            alert(e.message);
        }).finally(() => {
            setIsLoading(false);
        })
    }, []);

    const handleLeaveInput = (e) => {
        setLeaveData(p => {
            return { ...p, [e.target.name]: e.target.value };
        });
    }

    const handleLeaveSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        fetch(`${API_URL}/api/createleave`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth.token}`
            },
            body: JSON.stringify(leaveData)
        }).then(async (res) => {
            if (!res.ok) {
                throw new Error(await res.text());
            }
            return res.json();
        }).then(r => {
            alert(r.message);
            dispatch(addLeave(r.leave));
        }).catch(e => {
            alert(e.message);
        }).finally(() => {
            setIsLoading(false);
        })
    }

    return (
        <>
            {loader}
            <div className="leave__container">
                <div className="recent__leaves">
                    <h2>Recent Leaves</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Reason</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                leaves.map(l => (
                                    <tr key={l._id}>
                                        <td>{l.type}</td>
                                        <td>{new Date(l.startDate).toLocaleDateString()}</td>
                                        <td>{new Date(l.endDate).toLocaleDateString()}</td>
                                        <td>{l.description}</td>
                                        <td>{l.status}</td>
                                    </tr>
                                ))
                            }
                            {
                                leaves.length === 0 && <tr style={{ textAlign: "center" }}><td colSpan={5}>No Leaves Found</td></tr>
                            }
                        </tbody>
                    </table>
                </div>
                <div className="leave__apply_section">
                    <h2>Apply Leave</h2>
                    <form onSubmit={handleLeaveSubmit}>
                        <div className="form__input">
                            <label htmlFor="leaveType">Leave Type</label>
                            <select id="leaveType" name="type" onChange={handleLeaveInput}>
                                <option value="">Select Leave Type</option>
                                <option value="Sick Leave">Sick Leave</option>
                                <option value="Casual Leave">Casual Leave</option>
                                <option value="Annual Leave">Annual Leave</option>
                                <option value="Maaternity Leave">Maternity Leave</option>
                                <option value="Paternity Leave">Paternity Leave</option>
                                <option value="Unpaid Leave">Unpaid Leave</option>
                            </select>
                        </div>
                        <div className="form__input">
                            <label htmlFor="startDate">Start Date</label>
                            <input id="startDate" name="startDate" onChange={handleLeaveInput} type="date" placeholder="Start Date" />
                        </div>
                        <div className="form__input">
                            <label htmlFor="endDate">End Date</label>
                            <input id="endDate" name="endDate" onChange={handleLeaveInput} type="date" placeholder="End Date" />
                        </div>
                        <div className="form__input">
                            <label htmlFor="reason">Reason</label>
                            <input id="reason" name="reason" onChange={handleLeaveInput} type="text" placeholder="Reason" />
                        </div>
                        <button type="submit">Apply</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Leaves;