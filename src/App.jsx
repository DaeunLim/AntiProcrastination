import './global.css';
import React from 'react';
import timelyImage from './timely.jpg';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={timelyImage} alt="Timely Logo" className="centered-image" />
        <p>Your journey to productivity starts here.</p>
        <div className="button-container">
          <button className="login-button" onClick={() => alert('Login Clicked')}>Login</button>
          <button className="signup-button" onClick={() => alert('Signup Clicked')}>Signup</button>
        </div>
      </header>
    </div>
  );
}

export default App;