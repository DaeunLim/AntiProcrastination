import React from 'react';
import './App.css'; // Import your main styles
import Header from './components/Header/Header'; // Import modified Header with Sidebar
import TodoList from './components/TodoList';
import MiniCalendar from './components/MiniCalendar';
import SocialBox from './components/SocialBox';
import MainCalendar from './components/MainCalendar/MainCalendar';
import MonthCalendar from './components/MonthCalendar/MonthCalendar';

function App() {
  const currentDate = new Date();
  const month = currentDate.getMonth(); // Current month (0-11)
  const year = currentDate.getFullYear(); // Current year
  
  return (
    <div className="App">
      {/* Header and Sidebar */}
      <Header />

      {/* Main Content */}
      <div className="App-main">
        <div className="middle-section">
          <TodoList />
          <MonthCalendar month={month} year={year}/>
          
        </div>

        <div className="right-section">
          <SocialBox />
        </div>
      </div>

      
      
    </div>
  );
}

export default App;
