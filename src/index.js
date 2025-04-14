import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Include CSS if needed
import App from './App'; // Import the App component
import UnsignedPage from './components/UnsignedPage';
import {BrowserRouter} from "react-router-dom";
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
      <BrowserRouter>
          <App />
      </BrowserRouter>
  </React.StrictMode>
);
