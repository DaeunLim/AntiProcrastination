import React from 'react';
import Login from './components/Login';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Signup from "./components/Signup";
import Home from "./components/Home";
import App from "./App";
import MainCalendar from './components/MainCalendar/MainCalendar';

function Routing() {
    const currentDate = new Date();
    const month = currentDate.getMonth(); // Current month (0-11)
    const year = currentDate.getFullYear();
    return (
            <Routes>
                <Route path="/" element={<App/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/signup" element={<Signup/>} />
                <Route path="/home" element={<Home/>}/>
                <Route path="/calendar" element={<MainCalendar month={month} year={year}/>} />
            </Routes>
    )
}
export default Routing;