import React, { useState } from "react";
import axios from "axios";
import { useNavigate  } from "react-router-dom";

const Signin = () => {
    const navigate = useNavigate();

    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const signinaxios = (e) => {
        e.preventDefault();
        // 창이 새로고침되는 것을 막는다. 
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
            console.log(response);
            if (response.status === 200) {
              navigate("/todo");
            }
          })
          .catch((err) => {
            setMessage(err.response.data.message)
            console.log(err);
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
}

export default Signin;