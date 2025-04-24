import React, { useEffect } from 'react';
import './Header.css';
import {  Link, useNavigate  } from 'react-router-dom';
import timelyLogo from '../../image/timely.jpg'; // Import your logo image
import hamburger from '../../image/hamburger.png'; // Import your logo image
function Header({ onMenuClick, setVerified }) {
  const logout = async () => {
    await fetch("http://localhost:8080/api/user/logout", {
      method: "GET",
      credentials: "include",
    })
  };
  return (
    <header>
      <div className="top_header_bg"></div>
      <div className="header_container">
        <div className="left-header">
          <img src={hamburger} id="btn_more" aria-label="Menu" onClick={onMenuClick}></img>
          <img src={timelyLogo} alt="Timely Logo" className="logo" />

        </div>

        <ul id="top_nav">
          <li><Link onClick={() => {
            setVerified(false); logout()
          }} to="/"><span>Logout</span></Link></li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
