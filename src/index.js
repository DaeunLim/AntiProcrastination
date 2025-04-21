import React from 'react';
import ReactDOM from 'react-dom/client';
import './global.css'; // Include CSS if needed
import App from './App'; // Import the App component
import Routing from './Routing';
import {BrowserRouter} from "react-router-dom";
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
      <BrowserRouter>
          <Routing />
      </BrowserRouter>
  </React.StrictMode>
);
