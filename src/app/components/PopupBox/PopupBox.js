import React, { useState } from 'react';
import './PopupBox.css';

const PopupBox = ({ day, month, year, position, onClose, tasks = [], onAddTask, onDeleteTask }) => {
  if (!day) return null;

  const [taskInput, setTaskInput] = useState('');
  const [priority, setPriority] = useState('green');
  const [type, setType] = useState('assignment');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');


  const handleAddingTask = () => {
    if (taskInput.trim() !== '') {
      const newTask = {
        task: taskInput,
        type,
        priority,
        ...(type === 'event' ? { startTime, endTime } : {}),
      };
      onAddTask(newTask);
      setTaskInput('');
      setType('assignment');
      setPriority('green');
      setStartTime('');
      setEndTime('');
    }
  };

  const handleDeleteTask = (indexToDelete) => {
    const updatedTasks = tasks.filter((_, i) => i !== indexToDelete);
    onAddTask(updatedTasks); // Replace tasks with updated list
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
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="red">High (Red)</option>
          <option value="orange">Medium (Orange)</option>
          <option value="green">Low (Green)</option>
        </select>
      </div>

      <div className="button-arrange">
        <button className="popup-add" onClick={handleAddingTask}>Add</button>
        <button className="popup-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default PopupBox;
