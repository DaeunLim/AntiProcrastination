import React, { useState } from 'react';
import './App.css';  // Your main styles
import Header from './components/Header/Header'; // Header component
import Sidebar from './components/Sidebar';
import TodoList from './components/TodoList/TodoList'; // Todo List component
import SocialBox from './components/SocialBox'; // Social Box component
import MonthCalendar from './components/MonthCalendar/MonthCalendar'; // Small calendar
import MainCalendar from './components/MainCalendar/MainCalendar'; // Full calendar
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // React Router
import { useEffect } from 'react';

function App() {

  useEffect( () => {
    const username = "test";
    const password = "password";
    const owner = "";
    const subscribers = {};
    const dates = {};
    const testLogin = async () => {
      const res = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        'credentials': 'include',
        body: JSON.stringify({ username, password }),
      });
      const data = res;
      console.log(data);
      console.log(data.session.id);
    }
    const testAdd = async () => {
      const res = await fetch('http://localhost:8080/api/calendar/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ owner, subscribers, dates }),
      });
      const data = res;
      console.log(data);
    }
    const testVerify = async () => {
      const res = await fetch('http://localhost:8080/api/verify', {
        method: 'GET',
        'credentials': 'include',
      });
      const data = res;
      const { username } = data.body;
      console.log(username);
      console.log(data.session);
    }
    testLogin();
    //testAdd();
    testVerify();
  })
  const currentDate = new Date();
  const month = currentDate.getMonth(); // Current month (0-11)
  const year = currentDate.getFullYear(); // Current year

  //Sidebar
  const [calendars, setCalendars] = useState(['Calendar']);
  const [selectedCalendar, setSelectedCalendar] = useState('Calendar 01');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const addCalendar = () => {
    const newName = `Calendar ${calendars.length + 1}`;
    setCalendars([...calendars, newName]);
  };
  const deleteCalendar = (index) => {
    const newCalendars = calendars.filter((_, i) => i !== index);
    setCalendars(newCalendars);
  };
  const renameCalendar = (index, newName) => {
    const newCalendars = [...calendars];
    newCalendars[index] = newName;
    setCalendars(newCalendars);
  };
  const [sidebarOpen, setSidebarOpen] = useState(false);



  return (
    <Router>
      <div className="App">
        {/* Header and Sidebar */}

        <Header onMenuClick={() => setSidebarOpen(true)} />
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          calendars={calendars}
          onSelectCalendar={(name) => setSelectedCalendar(name)}
          onAddCalendar={addCalendar}
          onDeleteCalendar={deleteCalendar}
          onRenameCalendar={renameCalendar}
        />

        {/* Main Content */}
        <div className={`App-main ${sidebarOpen ? 'shifted' : ''}`}>
          <Routes>
            {/* Main Page - Only show this route when we are on "/" */}
            <Route
              path="/"
              element={
                <div className="main-content">
                  <div className="middle-section">
                    <TodoList />
                    <MonthCalendar month={month} year={year} />
                    <button className="add_calendar_btn" onClick={addCalendar}>+</button>

                  </div>

                  <div className="right-section">
                    <SocialBox />
                  </div>
                </div>
              }
            />

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


    </Router >
  );
}

export default App;
