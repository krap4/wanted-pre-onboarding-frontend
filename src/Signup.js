import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const navigate = useNavigate();

    const [emailinput, setEmailinput] = useState("");
    const [passwordinput, setPasswordinput] = useState("");
    const [message, setMessage] = useState("");

    const isValidEmail = (email) => {
        return email.includes("@");
    };

    const isValidPassword = (password) => {
        return password.length >= 8;
    };

    const isFormValid = () => {
        return isValidEmail(emailinput) && isValidPassword(passwordinput);
    };

    const registeraxios = () => {
        axios
            .post('https://www.pre-onboarding-selection-task.shop/auth/signup',
            {
                email: emailinput,
                password: passwordinput
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        .then((response) => {
            console.log(response);
            alert("회원가입성공");
            if ((response.status === 201)) {
              return navigate("/signin");
            }
          }).catch((err)=>{
            setMessage(err.response.data.message);
            console.log(err);
          });
    };

    return (
        <div className="signup">
            <div className="signup_input">
                <label>Email</label>
                <br/>
                <input
                    type="text"
                    placeholder="email..."
                    data-testid="email-input"
                    onChange={(e) => {
                        setEmailinput(e.target.value);
                        setMessage(""); // Clear any previous messages
                    }}
                    className={!message ? "inputLogin" : "err_password" }
                />
            </div>
            <div className="signup_input">
                <label>Password</label>
                <br/>
                <input
                    type="password"
                    placeholder="password..."
                    data-testid="password-input"
                    onChange={(e) => {
                        setPasswordinput(e.target.value);
                        setMessage(""); // Clear any previous messages
                    }}
                    className={!message ? "inputLogin" : "err_password" }
                />
                <p>{message}</p>
            </div>
            <button 
                onClick={registeraxios} 
                data-testid="signup-button"
                disabled={!isFormValid()}
            >
                회원가입
            </button>
        </div>
    );
};

export default Signup;
