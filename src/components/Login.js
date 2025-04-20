import React, {useState} from "react";
import ReactDOM from "react-dom";
import axios from 'axios';
import { BrowserRouter, Routes, Route, Link, useNavigate} from "react-router-dom";
import "./Login.css";
import Signup from "./Signup";
import loginImage from './login.jpg';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    //const [email, setEmail] = React.useState("");

    const history=useNavigate();
    async function submit(e) {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8080", {username, password})
                .then(res => {
                    if(res.data="Successfully logged in") { //Username is present
                        history("/home",{state:{id:username}}) //Passes email to welcome page
                    }
                    else if(res.data="Account does not exist") {
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
            <img src={timelyImage} alt="Timely Logo" className="centered-image" />
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
                <button type="submit">Login</button>
            </form>
                <br />
                <p>OR</p>
                <br />
                <Link to="/signup">Don't have an account? Signup here</Link>
        </div>
    );
};
export default Login;
