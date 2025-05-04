import React, { useState, useEffect, lazy, Suspense } from 'react';
import Header from './Header/Header'; // Header component
import Sidebar from './Sidebar';
import TodoList from './TodoList/TodoList'; // Todo List component
const MonthCalendar = lazy(() => import('./MonthCalendar/MonthCalendar')); // Small calendar
import MainCalendar from './MainCalendar/MainCalendar'; // Full calendar
import { useNavigate, Link, redirect } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom'; // React Router
import './Home.css'; // CSS styles for Home component
import axios from 'axios'; // Axios for API requests

function Home({ isLoading, isVerified, setVerified, user }) {
  const currentDate = new Date();
  const month = currentDate.getMonth(); // Current month (0-11)
  const year = currentDate.getFullYear(); // Current year

  //Sidebar & Calendar Status
  const [activeTab, setActiveTab] = useState(0);
  const [calendars, setCalendars] = useState([]);
  const [selectedCalendar, setSelectedCalendar] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [taskDataByCalendar, setTaskDataByCalendar] = useState({});

  const history = useNavigate();
  useEffect(() => {
    if (!isVerified) {
      history("/")
    } else {
      const getCalendars = async () => {
        const res = await fetch(`http://localhost:8080/api/calendar/`, {
          method: "GET",
          credentials: "include",
        })
        const data = await res.json();
        setCalendars(data);
        setSelectedCalendar(data[0])
      }
      getCalendars();
    }
  }, [isVerified, selectedCalendar, calendars])

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
  const addCalendar = async () => {
    const newName = `Calendar ${calendars.length + 1}`; // Generate a new calendar name
  
    try {
      // Send a POST request to the backend to add the new calendar
      const response = await axios.post("http://localhost:8080/api/calendar/add", { name: newName }, { withCredentials: true });
  
      if (response.status === 201) {
        // If the calendar is successfully added to the database, update the local state
        setCalendars([...calendars, newName]);
      } else {
        alert("Failed to add calendar to the database");
      }
    } catch (error) {
      console.error("Error adding calendar:", error);
      alert("An error occurred while adding the calendar");
    }
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
                        {calendars.map((calendar, idx) => (
                          <Suspense key={idx}>
                            <button
                              key={idx}
                              onClick={() => {
                                setActiveTab(idx);
                                setSelectedCalendar(calendar);
                              }}
                              className={idx === activeTab ? 'active-tab' : ''}
                            >
                              {calendar.name}
                            </button>
                          </Suspense>
                        ))}
                      </div>

                      {calendars.map((calendar, idx) => (
                        <Suspense key={idx}>
                          <div
                            key={idx}
                            className="calendar-tab-content"
                            style={{ display: idx === activeTab ? 'block' : 'none' }}
                          >
                            <MonthCalendar
                              month={month}
                              year={year}
                              calendar={calendar}
                              taskByDate={taskDataByCalendar[calendar.name] || {}}
                              onAddTask={(dateKey, taskObj) => addTaskToCalendar(calendar, dateKey, taskObj)}
                            />
                          </div>
                        </Suspense>
                      ))}
                    </div>
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
