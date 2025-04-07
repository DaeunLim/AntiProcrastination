import React, { useState } from 'react';
import './App.css'; // Import your main styles
import Header from './components/Header/Header'; // Import modified Header with Sidebar
import Sidebar from './components/Sidebar';
import TodoList from './components/TodoList';
import MiniCalendar from './components/MiniCalendar';
import SocialBox from './components/SocialBox';
import MainCalendar from './components/MainCalendar';
import MonthCalendar from './components/MonthCalendar/MonthCalendar';

function App() {
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
        <div className="middle-section">
          <TodoList />
          <MonthCalendar month={month} year={year} />
          <button className="add_calendar_btn" onClick={addCalendar}>+</button>

        </div>

        <div className="right-section">
          <SocialBox />
        </div>
      </div>


    </div>
  );
}

export default App;
