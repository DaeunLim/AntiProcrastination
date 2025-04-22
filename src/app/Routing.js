import React from 'react';
import Login from './components/Login';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Signup from "./components/Signup";
import Home from "./components/Home";
import App from ".";


function Routing() {
    return (
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<Home />} />
        </Routes>
    )
}
export default Routing;