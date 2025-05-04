import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import axios from 'axios';
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import "./Login.css";
import Signup from "./Signup";
import loginImage from '../image/login.jpg';

function Login({ isVerified, setVerified }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    //const [email, setEmail] = React.useState("");

    const history = useNavigate();
    useEffect(() => {
        if (isVerified) {
            history("/home")
        }
    }, [isVerified])
    async function submit(e) {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8080/api/user/login", { username, password }, { withCredentials: true },)
                .then(res => {
                    if (res.status == 200) { // Correct login
                        setVerified(true);
                        history("/home", { state: { user: res.data.user } }) // Passes user
                    }
                    else if (res.status == 404) {
                        alert("Account does not exist")
                    }
                })
                .catch(err => {
                    alert("Incorrect username or password")
                    console.log(err);
                })
        }
        catch (e) {
            console.log(e);
        }
    }

    return (
        <div className={"LoginForms"}>
            <div>
                <img src={loginImage} alt="Login" className="login-image" />
            </div>
            <form action="POST" onSubmit={submit}>
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
                <button className={'login-button2'} type="submit">Login</button>
            </form>
            <br />
            <p>OR</p>
            <br />
            <Link to="/signup">Don't have an account? Signup here</Link>
            <br />
            <Link to="/">Return Home</Link>
        </div>
    );
};
export default Login;
