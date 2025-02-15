import { API_URL } from "../App";

const EmployeeCard = ({ name, department, email, designation, profileImageUrl }) => {
    return (
        <div className="employee__card">
            <img className="employee__img" src={`${API_URL}${profileImageUrl}`} alt="emp" />
            <div className="employee__info">
                <h3>{name}</h3>
                <p>Department: {department}</p>
                <p>Email: {email}</p>
                <p>Designation: {designation}</p>
            </div>
        </div>
    );
}

export default EmployeeCard;