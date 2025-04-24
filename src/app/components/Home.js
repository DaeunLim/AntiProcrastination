import React, { useState } from 'react';
import Header from './Header/Header'; // Header component
import Sidebar from './Sidebar';
import TodoList from './TodoList/TodoList'; // Todo List component
import SocialBox from './SocialBox'; // Social Box component
import MonthCalendar from './MonthCalendar/MonthCalendar'; // Small calendar
import MainCalendar from './MainCalendar/MainCalendar'; // Full calendar
import { useNavigate, Link } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom'; // React Router
import './Home.css'; // CSS styles for Home component

function Home() {
  const currentDate = new Date();
  const month = currentDate.getMonth(); // Current month (0-11)
  const year = currentDate.getFullYear(); // Current year

  //Sidebar & Calendar Status
  const [activeTab, setActiveTab] = useState(0);
  const [calendars, setCalendars] = useState(['Calendar']);
  const [selectedCalendar, setSelectedCalendar] = useState('Calendar');
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
  //


  return (
    //<Router> --deleted since the render is wrapped in <BrowserRouter>
    <div className="Home">
      {/* Header and Sidebar */}

      <Header onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        calendars={calendars}
        onSelectCalendar={(name) => {
          const idx = calendars.indexOf(name);
          if (idx !== -1) setActiveTab(idx);
        }}
        onAddCalendar={addCalendar}
        onDeleteCalendar={deleteCalendar}
        onRenameCalendar={renameCalendar}
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
                          onClick={() => setActiveTab(idx)}
                          className={idx === activeTab ? 'active-tab' : ''}
                        >
                          {name}
                        </button>
                      ))}
                    </div>

                    {calendars.map((name, idx) => (
                      <div
                        key={idx}
                        style={{ display: idx === activeTab ? 'block' : 'none' }}
                      >
                        <MonthCalendar month={month} year={year} />
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
                <MainCalendar month={month} year={year}
                />
              </div>
            } />

        </Routes>
      </div>
    </div>
  );
}

export default Home;
