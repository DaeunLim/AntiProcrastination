import React, { useEffect } from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import hamburger from '../../image/hamburger.png';
import timelyLogo from '../../image/timely.jpg'; // Import your logo image
function Header({ onMenuClick }) {
  return (
    <header>
      <div className="top_header_bg"></div>
      <div className="header_container">
        <div className="left-header">
          <img src={hamburger} id="btn_more" aria-label="Menu" onClick={onMenuClick}></img>
          <img src={timelyLogo} alt="Timely Logo" className="logo" />

        </div>

        <ul id="top_nav">
          <li><Link to="/"><span>Log out</span></Link></li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
