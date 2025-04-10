import React from 'react';
import './App.css'; // Import your main styles
import Header from './components/Header/Header'; // Import modified Header with Sidebar
import TodoList from './components/TodoList';
import MiniCalendar from './components/MiniCalendar';
import SocialBox from './components/SocialBox';
import MainCalendar from './components/MainCalendar';
import MonthCalendar from './components/MonthCalendar/MonthCalendar';
import { useEffect } from 'react';

function App() {
  /* TESTING FUNCTION FOR SERVER STUFF
  useEffect(() => {
    const test = async () => {
      const owner = "67f721c76b85fdd0c4c67eb1"
      const subscribers = []
      const dates = []
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2Y3MjFjNzZiODVmZGQwYzRjNjdlYjEiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJ1c2VybmFtZSI6InRlc3QiLCJjYWxlbmRhcnMiOltdLCJpYXQiOjE3NDQyNTMzODQsImV4cCI6MTc0Njg0NTM4NH0.YIvp8S4pHkANTvAmkH59Do4deq9kq0O5lWDT7JhvgPU"
      const res = await fetch('http://localhost:8080/api/calendar/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ owner, subscribers, dates, token }),
      });
      /*Authorization: Bearer <JWT_TOKEN>*/
      /*const username = "test";
      const email = "test@example.com";
      const password = "password";
      const res = await fetch('http://localhost:8080/api/login', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
      });
      //res.json().then(data => console.log(data));
    }
    test();
  });*/
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
