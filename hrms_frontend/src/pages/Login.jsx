import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import useLoader from "../components/Loader.jsx";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../redux/authSlice";
import { API_URL } from "../App.jsx";

const Login = () => {
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({});
    const { loader, setIsLoading } = useLoader();
    const dispatch = useDispatch();
    const { auth } = useSelector(state => state.auth);

    const handleInput = (e) => {
        setLoginData(p => {
            return { ...p, [e.target.name]: e.target.value };
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        fetch(`${API_URL}/api/login/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(loginData)
        }).then(async (res) => {
            if (!res.ok) {
                throw new Error(await res.text());
            }
            return res.json();
        }).then(r => {
            setIsLoading(false);
            dispatch(setAuth(r));
            localStorage.setItem("authData", JSON.stringify(r));
            navigate("/");
        }).catch(e => {
            setIsLoading(false);
            alert(e.message);
        })
    }
    return (
        <>
            {loader}
            <div className="login-form-container">
                <form className="login-form">
                    <h2>HRMS</h2>
                    <input type="email" name="email" onChange={handleInput} placeholder="Email" />
                    <input type="password" name="password" onChange={handleInput} placeholder="Password" />
                    <button type="submit" className="login-button" onClick={handleSubmit}>Login</button>
                </form>
            </div >
        </>
    );
};

export default Login;