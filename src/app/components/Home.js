import React, { useState, useEffect } from 'react';
import Header from './Header/Header'; // Header component
import Sidebar from './Sidebar';
import TodoList from './TodoList/TodoList'; // Todo List component
import SocialBox from './SocialBox'; // Social Box component
import MonthCalendar from './MonthCalendar/MonthCalendar'; // Small calendar
import MainCalendar from './MainCalendar/MainCalendar'; // Full calendar
import { useNavigate, Link } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom'; // React Router
import './Home.css'; // CSS styles for Home component

function Home({ isVerified, setVerified, user }) {
  const currentDate = new Date();
  const month = currentDate.getMonth(); // Current month (0-11)
  const year = currentDate.getFullYear(); // Current year

  //Sidebar & Calendar Status
  const [activeTab, setActiveTab] = useState(0);
  const [calendars, setCalendars] = useState(['Calendar']);
  const [selectedCalendar, setSelectedCalendar] = useState('Calendar');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [taskDataByCalendar, setTaskDataByCalendar] = useState({});

  const addTaskToCalendar = (calendarName, dateKey, taskObj) => {
    setTaskDataByCalendar(prev => ({
      ...prev,
      [calendarName]: {
        ...(prev[calendarName] || {}),
        [dateKey]: [...(prev[calendarName]?.[dateKey] || []), taskObj]
      }
    }));
  };

  //sidebar
  const addCalendar = () => {
    const newName = `Calendar ${calendars.length + 1}`;
    setCalendars([...calendars, newName]);
  };
  const deleteCalendar = (index) => {
    const calendarName = calendars[index];
    const confirmed = window.confirm(`Are you sure you want to delete "${calendarName}"? This cannot be undone.`);
    if (!confirmed) return;
  
    const newCalendars = calendars.filter((_, i) => i !== index);
    setCalendars(newCalendars);
  };
  
  const renameCalendar = (index, newName) => {
    const newCalendars = [...calendars];
    newCalendars[index] = newName;
    setCalendars(newCalendars);
  };
  const [sidebarOpen, setSidebarOpen] = useState(false);
  //

  return (
    //<Router> --deleted since the render is wrapped in <BrowserRouter>
    <div className="Home">
      {/* Header and Sidebar */}

      <Header onMenuClick={() => setSidebarOpen(true)} setVerified={() => setVerified()} />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        calendars={calendars}
        onSelectCalendar={(name) => {
          const idx = calendars.indexOf(name);
          if (idx !== -1) {
            setActiveTab(idx);
            setSelectedCalendar(name);
          }
        }}
        onAddCalendar={addCalendar}
        onDeleteCalendar={deleteCalendar}
        onRenameCalendar={renameCalendar}
        user={user}
      />

      {/* Main Content */}
      <div className={`Home-main ${sidebarOpen ? 'shifted' : ''}`}>
        {/* Using useNavigate */}

        <Routes>
          <Route
            index
            element={
              <div className="home-main-content">
                <TodoList />

                {/* Calendar Tabs */}
                <div className="home-middle-section">
                  <div className="calendar-tabs-wrapper">
                    <div className="tab-buttons">
                      {calendars.map((name, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setActiveTab(idx);
                            setSelectedCalendar(name);
                          }}
                          className={idx === activeTab ? 'active-tab' : ''}
                        >
                          {name}
                        </button>
                      ))}
                    </div>

                    {calendars.map((name, idx) => (
                      <div
                        key={idx}
                        className="calendar-tab-content"
                        style={{ display: idx === activeTab ? 'block' : 'none' }}
                      >
                        <MonthCalendar
                          month={month}
                          year={year}
                          taskByDate={taskDataByCalendar[name] || {}}
                          onAddTask={(dateKey, taskObj) => addTaskToCalendar(name, dateKey, taskObj)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="home-right-section">
                  <SocialBox />
                </div>
              </div>
            }
          />
          <Route
            path="/calendar"
            element={
              <div className="home-main-content">
                <MainCalendar
                  month={month}
                  year={year}
                  taskByDate={taskDataByCalendar[selectedCalendar] || {}}
                  onAddTask={(dateKey, taskObj) => addTaskToCalendar(selectedCalendar, dateKey, taskObj)}
                />
              </div>
            } />

        </Routes>
      </div>
    </div>
  );
}

export default Home;
