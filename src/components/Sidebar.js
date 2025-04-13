import React, { useState } from 'react';
import './Sidebar.css';


function Sidebar({ isOpen, onClose, calendars, onSelectCalendar, onAddCalendar, onDeleteCalendar, onRenameCalendar }) {

  const [editingIndex, setEditingIndex] = useState(null);
  const [editName, setEditName] = useState('');

  const handleRenameStart = (index, currentName) => {
    setEditingIndex(index);
    setEditName(currentName);
  };

  const handleRenameSubmit = () => {
    if (editName.trim()) {
      onRenameCalendar(editingIndex, editName.trim());
    }
    setEditingIndex(null);
    setEditName('');
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="drawer_body">
        <button id="btn_drawer_close" onClick={onClose}></button>


        <div className="drawer_fixed">
          <div className='drawer_app'>
            <div className="logo">
              {/* You can add an actual logo image here */}
              <img src="path-to-your-logo.png" alt="Logo" className="logo-img" />
            </div>
            <h1 className="title">Calendar App</h1>

          </div>

          <div className="drawer_profile">

            <div className="avatar" />
            <div className="user_info">
              <p className="username">UserName</p>
              <p className="rank">{'{rank}'}</p>
              <p className="login">login</p>
            </div>
          </div>

          <ul className="drawer_nav">
            <li><a href="">Home</a></li>

            <li><a href="">To-do list</a></li>
            <li><a href="">Social</a></li>
          </ul>


        </div>
        <div className="drawer_menu">
          <ul className="drawer_calendars">
            {calendars.map((name, idx) => (
              <li key={idx}>
                {editingIndex === idx ? (
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={handleRenameSubmit}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRenameSubmit();
                      if (e.key === 'Escape') setEditingIndex(null);
                    }}
                    autoFocus
                  />
                ) : (
                  <span onClick={() => onSelectCalendar(name)}>{name}</span>)}
                <div className="calendar_edit">
                  <button className="rename" onClick={() => handleRenameStart(idx, name)} />
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
