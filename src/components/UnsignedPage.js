import React from 'react';
import Login from './Login';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Signup from "./Signup";

function UnsignedPage() {
    return (
            <Routes>
                <Route path="/" element={<Login/>} />
                <Route path="/signup" element={<Signup/>} />
                <Route path={"/home"} element={<Home/>}/>
            </Routes>
    )
}
export default UnsignedPage;