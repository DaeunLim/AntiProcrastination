import React, { useState } from 'react';
import './PopupBox.css';

const PopupBox = ({ day, month, year, position, onClose, tasks = [], onAddTask, onDeleteTask }) => {
  if (!day) return null;

  const [taskInput, setTaskInput] = useState('');
  const [type, setType] = useState('assignment');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getUrgencyColor = (dueStr) => {
    const due = new Date(dueStr);
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    if (diff < 0) return 'gray';
    if (diff <= 1) return 'red';
    if (diff <= 3) return 'yellow';
    return 'green';
  };

  const handleAddingTask = () => {
    if (!taskInput.trim()) return;

    const date = new Date(year, month, day);
    const task = {
      name: taskInput,
      taskType: type,
      date,
      from: startTime || '',
      to: endTime || '',
      priority: getUrgencyColor(date)
    };

    onAddTask(task);
    onClose();
  };

  return (
    <div
      className="date-popup"
      style={{
        position: 'absolute',
        top: position.y + 5,
        left: position.x,
        background: '#ffd1c7',
        width: '300px',
        borderRadius: '10px',
      }}
    >
      <div className="popup-header">
        <strong>{`Tasks for ${month + 1}/${day}`}</strong>
      </div>

      <div className="popup-input">
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="assignment">Assignment</option>
          <option value="event">Event</option>
        </select>
        <input
          type="text"
          placeholder="Task name..."
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
        />
        {type === 'event' && (
          <>
            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </>
        )}
      </div>

      <div className="button-arrange">
        <button className="popup-add" onClick={handleAddingTask}>Add</button>
        <button className="popup-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default PopupBox;
