import React, { useEffect } from 'react';
import './Header.css';
import {Link} from 'react-router-dom';
import timelyLogo from '../../image/timely.jpg'; // Import your logo image
function Header({ onMenuClick }) {
  return (
    <header>
      <div className="top_header_bg"></div>

      <div className="header_container">
          {/* You can add an actual logo image here */}
        <img src={timelyLogo} alt="Timely Logo" className="logo" />
        <button id="btn_more" aria-label="Menu" onClick={onMenuClick}></button>
        <ul id="top_nav">
          <li><Link to="/"><span>Log out</span></Link></li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
