import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../App';
import useLoader from '../components/Loader';
import { setLeave, clearLeave } from '../redux/leaveActionSlice';

const LeaveRequest = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.user);
    const { auth } = useSelector(state => state.auth);
    const { leaves } = useSelector(state => state.leaveAction);
    const navigate = useNavigate();
    const { loader, setIsLoading } = useLoader();
    useEffect(() => {
        if (!user.isAdmin) {
            navigate("/");
            return;
        }
        setIsLoading(true);
        fetch(`${API_URL}/api/admin/leavesforaction`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth?.token}`
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

    const handleLeaveAction = (leaveId, status) => {
        if (!confirm(`Are you sure you want to ${status} this leave?`)) {
            return;
        }
        setIsLoading(true);
        fetch(`${API_URL}/api/admin/leaveaction`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth?.token}`
            },
            body: JSON.stringify({ leaveId, status })
        }).then(async (res) => {
            if (!res.ok) {
                throw new Error(await res.text());
            }
            dispatch(clearLeave(leaveId));
        }).catch(e => {
            alert(e.message);
        }).finally(() => {
            setIsLoading(false);
        })
    }
    return (
        <>
            {loader}
            <div className="leaverequest__container">
                <h2>Leave Requests</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Department</th>
                            <th>Designation</th>
                            <th>Type</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Reason</th>
                            <th>Approve</th>
                            <th>Reject</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            leaves.length === 0 &&
                            <tr>
                                <td colSpan={9}>No leaves found</td>
                            </tr>
                        }
                        {leaves.map((leave, i) => (
                            <tr key={i}>
                                <td>{leave.userName}</td>
                                <td>{leave.department}</td>
                                <td>{leave.designation}</td>
                                <td>{leave.type}</td>
                                <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                                <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                                <td>{leave.description}</td>
                                <td><CheckCircleOutlineIcon style={{ color: "green", cursor: "pointer" }} onClick={() => { handleLeaveAction(leave._id, "Approved") }} /></td>
                                <td><CloseIcon style={{ color: "red", cursor: "pointer" }} onClick={() => { handleLeaveAction(leave._id, "Rejected") }} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default LeaveRequest;