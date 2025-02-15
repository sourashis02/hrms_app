import { useState, useRef } from "react";
import { API_URL } from "../App.jsx";
import useLoader from "../components/Loader.jsx";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreateEmployee = () => {
    const navigate = useNavigate();
    const [employeeData, setEmployeeData] = useState({});
    const fileInput = useRef();

    const { auth } = useSelector(state => state.auth);

    const { loader, setIsLoading } = useLoader();

    const handleInput = (e) => {
        setEmployeeData(p => {
            if (e.target.name === "isAdmin") {
                return { ...p, [e.target.name]: e.target.checked }
            }
            return { ...p, [e.target.name]: e.target.value }
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        let formData = new FormData();
        formData.append("name", employeeData.name);
        formData.append("email", employeeData.email);
        formData.append("phone", employeeData.phone);
        formData.append("designation", employeeData.designation);
        formData.append("department", employeeData.department);
        formData.append("password", employeeData.password);
        formData.append("aadharNo", employeeData.aadharNo);
        formData.append("panNo", employeeData.panNo);
        formData.append("bankName", employeeData.bankName);
        formData.append("bankAccountNumber", employeeData.bankAccountNumber);
        formData.append("ifscCode", employeeData.ifscCode);
        formData.append("emergencyContact", employeeData.emergencyContact);
        formData.append("baseSalary", employeeData.baseSalary);
        formData.append("reportingManager", employeeData.reportingManager);
        formData.append("isAdmin", employeeData.isAdmin === undefined ? false : employeeData.isAdmin);
        formData.append("image", fileInput.current.files[0]);
        console.log(employeeData, JSON.stringify(formData.entries(), null, 3));
        fetch(`${API_URL}/api/admin/createuser`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${auth.token}`
            },
            body: formData,
            redirect: "follow"
        }).then(async (res) => {
            if (res.status === 401) {
                localStorage.removeItem("authData");
                localStorage.removeItem("user");
                window.location.reload();
            }
            if (!res.ok) {
                throw new Error(await res.text());
            }
            alert("Employee Created Successfully");
            navigate("/");
            setEmployeeData({});
        }).catch(err => {
            alert(err.message);
            console.log(err);
        }).finally(() => {
            setIsLoading(false);
        })
    }

    return (
        <>
            {loader}
            <div className="createemployee__container">
                <h2>Create Employee</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form__input">
                        <label htmlFor="name">Name</label>
                        <input type="text" name="name" id="name" placeholder="Enter Name" onChange={handleInput} />
                    </div>
                    <div className="form__input">
                        <label htmlFor="image">Profile Image</label>
                        <input ref={fileInput} type="file" id="image" />
                    </div>
                    <div className="form__input">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" placeholder="Enter Email" onChange={handleInput} />
                    </div>
                    <div className="form__input">
                        <label htmlFor="phone">Phone</label>
                        <input type="text" name="phone" id="phone" placeholder="Enter Phone Number" onChange={handleInput} />
                    </div>
                    <div className="form__input">
                        <label htmlFor="designation">Designation</label>
                        <input type="text" name="designation" id="designation" placeholder="Enter Designation" onChange={handleInput} />
                    </div>
                    <div className="form__input">
                        <label htmlFor="department">Department</label>
                        <input type="text" name="department" id="department" placeholder="Enter Department" onChange={handleInput} />
                    </div>
                    <div className="form__input">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" placeholder="Enter Password" onChange={handleInput} />
                    </div>
                    <div className="form__input">
                        <label htmlFor="aadharNo">Aadhar Number</label>
                        <input type="text" name="aadharNo" id="aadharNo" placeholder="Enter Aadhar Number" onChange={handleInput} />
                    </div>
                    <div className="form__input">
                        <label htmlFor="panNo">PAN Number</label>
                        <input type="text" name="panNo" id="panNo" placeholder="Enter PAN Number" onChange={handleInput} />
                    </div>
                    <div className="form__input">
                        <label htmlFor="bankName">Bank Name</label>
                        <input type="text" name="bankName" id="bankName" placeholder="Enter Bank Name" onChange={handleInput} />
                    </div>
                    <div className="form__input">
                        <label htmlFor="accountNo">Bank Account Number</label>
                        <input type="text" name="bankAccountNumber" id="accountNo" placeholder="Enter Bank Account Number" onChange={handleInput} />
                    </div>
                    <div className="form__input">
                        <label htmlFor="ifscCode">IFSC Code</label>
                        <input type="text" name="ifscCode" id="ifscCode" placeholder="Enter IFSC Code" onChange={handleInput} />
                    </div>
                    <div className="form__input">
                        <label htmlFor="emergencyContact">Emergency Contact</label>
                        <input type="text" name="emergencyContact" id="emergencyContact" placeholder="Enter Emergency Contact Number" onChange={handleInput} />
                    </div>
                    <div className="form__input">
                        <label htmlFor="baseSalary">Base Salary</label>
                        <input type="number" name="baseSalary" id="baseSalary" placeholder="Enter Base Salary" onChange={handleInput} />
                    </div>
                    <div className="form__input">
                        <label htmlFor="reportingManager">Reporting Manager</label>
                        <input type="text" name="reportingManager" id="reportingManager" placeholder="Enter Reporting Manager Email" onChange={handleInput} />
                    </div>
                    <div className="form__input">
                        <label htmlFor="isAdmin">Is Admin</label>
                        <input type="checkbox" name="isAdmin" id="isAdmin" onChange={handleInput} />
                    </div>
                    <button type="submit">Create Employee</button>
                </form>
            </div>
        </>
    );
}

export default CreateEmployee;