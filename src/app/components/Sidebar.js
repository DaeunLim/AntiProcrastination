import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigating to another page
import timelyLogo from '../image/sidebarTimely.jpg';
import close from '../image/x.png';

import './Sidebar.css';


function Sidebar({ isOpen, onClose, calendars, onSelectCalendar, onAddCalendar, onDeleteCalendar, onRenameCalendar, user }) {

  const [editingIndex, setEditingIndex] = useState(null);
  const [editName, setEditName] = useState('');
  const navigate = useNavigate(); // for calendar

  const handleRenameStart = (index, currentName) => {
    setEditingIndex(index);
    setEditName(currentName);
  };

  const handleRenameSubmit = async (calendar) => {
    try {
      if (editName.trim() != calendar.name) {
        onRenameCalendar(editingIndex, editName.trim());
        const res = await fetch(`http://localhost:8080/api/calendar/update/${calendar._id}`, {
          method: "PUT",
          credentials: 'include',
          headers: {
            'Content-Type': 'Application/json',
          },
          body: JSON.stringify({ name: editName.trim() })
        })
      }
      setEditingIndex(null);
      setEditName('');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="drawer_body">
        <img src={close} id="btn_drawer_close" onClick={onClose}></img>


        <div className="drawer_fixed">
          <div className='drawer_app'>
            <div className="logo">
              <img src={timelyLogo} alt="Logo" className="logo-img" />
            </div>
          </div>

          <div className="drawer_profile">

            <div className="avatar">{user.username.charAt(0)}</div>
            <div className="user_info">
              <p className="username">{user.username}</p>
              <p className="rank">Tasks completed: {user.tasks_completed}</p>
            </div>
          </div>

          <ul className="drawer_nav">
            <li>
              <a onClick={() => navigate('/home')}>Home</a>
            </li>
          </ul>


        </div>
        <div className="drawer_menu">
          <div className="calendar-header">
            <button className="add-calendar-btn" onClick={onAddCalendar}>+</button>
          </div>
          <ul className="drawer_calendars">
            {calendars.map((calendar, idx) => (
              <li key={idx}>
                {editingIndex === idx ? (
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={() => handleRenameSubmit(calendar)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRenameSubmit(calendar);
                      if (e.key === 'Escape') setEditingIndex(null);
                    }}
                    autoFocus
                  />
                ) : (
                  // When a calendar is clicked, select it and navigate to the calendar page
                  <span onClick={() => {
                    onSelectCalendar(calendar);
                    //navigate('/calendar', { state: { selectedCalendar: calendar.name } }); // Pass selected calendar to the next page
                  }}>
                    {calendar.name}
                  </span>)}
                <div className="calendar_edit">
                  <div className="rename" onClick={() => handleRenameStart(idx, calendar.name)} >✎</div>
                  <button onClick={() => onDeleteCalendar(idx)}>X</button>
                </div>

              </li>
            ))}
          </ul>

        </div>
      </div>


    </aside >
  );
}

export default Sidebar;
