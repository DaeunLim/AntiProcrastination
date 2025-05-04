import React, { useState, useEffect, Suspense, lazy } from 'react';
import { redirect, Route, Routes } from "react-router-dom";
import Signup from "./components/Signup";
const Home = lazy(() => import("./components/Home"));
const Login = lazy(() => import("./components/Login"));
import App from "./App";
import MainCalendar from './components/MainCalendar/MainCalendar';
import MonthCalendar from './components/MonthCalendar/MonthCalendar';

function Routing() {
    const currentDate = new Date();
    const month = currentDate.getMonth(); // Current month (0-11)
    const year = currentDate.getFullYear();
    const defaultUser = { username: "hello" };
    const [user, setUser] = useState(defaultUser);
    const [isVerified, setVerified] = useState(false);
    const [wasLoaded, setLoaded] = useState(false); // on first page load
    const [isLoading, setLoading] = useState(true); // if page is still loading
    // Shared state for taskByDate
    const [taskByDate, setTaskByDate] = useState({});
    useEffect(() => {
        if (!wasLoaded) {
            const verify = async () => {
                const res = await fetch("http://localhost:8080/api/user/verify", {
                    method: "GET",
                    credentials: "include",
                })
                if (res.status == 200) {
                    const data = await res.json();
                    setVerified(true);
                    setUser(data);
                    setLoading(false);
                }
            }
            verify();
            setLoaded(true);
        }
    })
    return (
        <Routes>
            <Route path="/" element={<App isVerified={isVerified} />} />
            <Route path="/login" element={
                <Suspense>
                    <Login isVerified={isVerified} setVerified={setVerified} />
                </Suspense>} />
            <Route path="/signup" element={<Signup isVerified={isVerified} />} />
-           <Route path="/home" element={<Home isLoading={isLoading} isVerified={isVerified} setVerified={setVerified} user={user} />} />
            
            <Route path="/calendar" element={
                <MainCalendar
                    month={month}
                    year={year}
                    taskByDate={taskByDate}
                    setTaskByDate={setTaskByDate}
                />
            } />
            <Route path="/month" element={
                <MonthCalendar
                    month={month}
                    year={year}
                    taskByDate={taskByDate}
                />
            } />        </Routes>
    )
}
export default Routing;