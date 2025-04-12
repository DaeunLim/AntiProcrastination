import React from 'react';
import './App.css';  // Your main styles
import Header from './components/Header/Header'; // Header component
import TodoList from './components/TodoList'; // Todo List component
import SocialBox from './components/SocialBox'; // Social Box component
import MonthCalendar from './components/MonthCalendar/MonthCalendar'; // Small calendar
import MainCalendar from './components/MainCalendar/MainCalendar'; // Full calendar
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // React Router

function App() {
  const currentDate = new Date();
  const month = currentDate.getMonth(); // Current month (0-11)
  const year = currentDate.getFullYear(); // Current year
  
  return (
    <Router>
      <Header />
      <div className="App">
        {/* Header and Sidebar */}
        

        {/* Conditional rendering based on the current route */}
        <div className="App-main">
          <Routes>
            {/* Main Page - Only show this route when we are on "/" */}
            <Route
              path="/"
              element={
                <div className="main-content">
                  <div className="middle-section">
                    <TodoList />
                    <MonthCalendar month={month} year={year} />
                  </div>

                  <div className="right-section">
                    <SocialBox />
                  </div>
                </div>
              }
            />

            {/* Full Calendar Page - Only show this when the route is "/calendar" */}
            <Route 
              path="/calendar"
              element={
                <div className="main-content">
              <MainCalendar month={month} year={year}
                />
                </div>
              } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
