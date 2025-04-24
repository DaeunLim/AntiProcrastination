import './global.css';
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import timelyImage from './image/timely.jpg';

function App({ isVerified }) {
  return (
    <div className="App">
      <header className="App-header">
        <img src={timelyImage} alt="Timely Logo" className="centered-image" />
        <h1 className="title">Welcome to Timely</h1>
        <h2 className="about">Timely is an anti-procrastination application. Improve your 
          productivity through an interactive calendar, task manager, and competitive leaderboard.
        </h2>
        <div className="button-container">
          <Link to={isVerified ? "/home" : "/login"}>
            <button className="login-button">Login</button>
          </Link>
          <Link to={isVerified ? "/home" : "/signup"}>
            <button className="signup-button">Signup</button>
          </Link>
        </div>
      </header>
    </div>
  );
}

export default App;