import React from 'react';
import './Header.css'; // If you want separate CSS for header and sidebar
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  const handleTitleClick = () => {
    navigate('/');  // Navigate to FullCalendarPage when title is clicked
  };

  return (
    <div className="header-container">
      {/* Header Section */}
      <header onClick={handleTitleClick} className="header">
        <div className="logo">
          {/* You can add an actual logo image here */}
          <img src="path-to-your-logo.png" alt="Logo" className="logo-img" />
        </div>
        <h1 className="title">Calendar App</h1>
      </header>

      {/* Sidebar Section */}
      <div className="sidebar">
        <ul>
          <li><a href="#">Tab 1</a></li>
          <li><a href="#">Tab 2</a></li>
          <li><a href="#">Tab 3</a></li>
          <li><a href="#">Tab 4</a></li>
        </ul>
      </div>
    </div>
  );
}

export default Header;
