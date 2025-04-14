import React, {useState} from "react";
import ReactDOM from "react-dom";
import {BrowserRouter, Routes, useNavigate, Link} from "react-router-dom";
import axios from "axios";

function Signup() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const history=useNavigate();
    async function submit(e) {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8080/Signup", {username, password})
                .then(res => {
                    if(res.data="Email already used for an existing account") { //Email already signed up
                        alert("Email already used for an existing account")
                    }
                    else if(res.data="Account does not exist") {
                        history("/Home",{state:{id:username}}) //Passes email to welcome page
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

        <div className={"SignupForms"}>
            <div>
                <h2>Signup</h2>
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
                <button type="submit">Login</button>
            </form>
            <br />
            <p>OR</p>
            <br />
            <Link to="/">Already have an account? Login here</Link>
        </div>
    )
}
export default Signup;