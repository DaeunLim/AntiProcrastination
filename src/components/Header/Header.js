import React, { useEffect } from 'react';
import './Header.css';
import {Link} from 'react-router-dom';

function Header({ onMenuClick }) {
  return (
    <header>
      <div className="top_header_bg"></div>

      <div className="header_container">
          {/* You can add an actual logo image here */}

        <button id="btn_more" aria-label="Menu" onClick={onMenuClick}></button>
        <ul id="top_nav">
          <li><Link to="/login"><span>Login</span></Link></li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
