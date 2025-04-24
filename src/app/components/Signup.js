import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Signup.css";
import signupImage from '../image/signup.jpg';

function Signup({ isVerified }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const history = useNavigate();
    useEffect(() => {
        if (isVerified) {
            history("/home")
        }
    })
    async function submit(e) {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:8080/api/user/signup", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            })

            if (res.status != 201) { //Email already signed up
                alert("Email or username already used for an existing account")
            } else {
                history("/");
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    return (

        <div className={"SignupForms"}>
            <div>
                <img src={signupImage} alt="Signup" className="signup-image" />
            </div>
            <form action="POST" onSubmit={submit}>
                <div className={"emailForm"}>
                    <input
                        type="email"
                        placeholder={"email"}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required={true}
                    />
                </div>
                <div className={"usernameForm"}>
                    <input
                        type="text"
                        placeholder={"Username"}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required={true}
                    />
                </div>
                <div className={"passwordForm"}>
                    <input
                        type={"password"}
                        placeholder={"Password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required={true}
                    />
                </div>
                <button className={'signup-button2'} type="submit">Signup</button>
            </form>
            <br />
            <p>OR</p>
            <br />
            <Link to="/login">Already have an account? Login here</Link>
            <br />
            <Link to="/">Return Home</Link>
        </div>
    )
}
export default Signup;