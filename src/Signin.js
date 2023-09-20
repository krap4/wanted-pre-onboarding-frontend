import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import './Signin.css';

const Signin = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        // Check for the token in local storage
        const token = localStorage.getItem("access_token");

        if (token && (location.pathname === "/signin" || location.pathname === "/signup")) {
            navigate("/todo");
        } else if (!token && location.pathname === "/todo") {
            navigate("/signin");
        }
    }, [location, navigate]);

    const signinaxios = (e) => {
        e.preventDefault();
        axios
            .post('https://www.pre-onboarding-selection-task.shop/auth/signin',
            {
                email: email,
                password: password
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        .then((response) => {
            localStorage.setItem("access_token", response.data.access_token);
            if (response.status === 200) {
              navigate("/todo");
            }
        })
        .catch((err) => {
            setMessage(err.response.data.message);
        });
    };

      return (
        <div className="Signin">
        <div className="inputemail">
            <label>Email</label>
            <br/>
            <input
                type="text"
                onChange={(e) => setEmail(e.target.value)}
                className={!message ? "inputSignin" : "err_password"}
                placeholder="email..."
                data-testid="email-input"
            />
        </div>
        <div className="inputpassword">
            <label>Password</label>
            <br/>
            <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                className={!message ? "inputLogin" : "err_password"}
                placeholder="password..."
                data-testid="password-input"
            />
            <p className="err">{message}</p>
        </div>
        <button className="buttonlogin" onClick={signinaxios} data-testid="signin-button">로그인</button>
    </div>
      )
};

export default Signin;