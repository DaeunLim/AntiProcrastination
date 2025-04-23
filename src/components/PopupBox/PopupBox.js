import React, { useState } from 'react';
import './PopupBox.css';

const PopupBox = ({ day, month, year, position, onClose, tasks = [], onAddTask, onDeleteTask}) => {
  if (!day) return null;

  const [taskInput, setTaskInput] = useState('');
  const [priority, setPriority] = useState('green');

  const handleAddingTask = () => {
    if (taskInput.trim() !== '') {
      onAddTask({ task: taskInput, priority });
      setTaskInput('');
      setPriority('green');
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
        <strong>{`Tasks for ${day}/${month + 1}/${year}`}</strong>
      </div>

      <div className="popup-task-list">
        {tasks.length === 0 ? (
          <p>No tasks</p>
        ) : (
          <ul>
            {tasks.map((taskObj, index) => {
              const taskText = typeof taskObj === 'string' ? taskObj : taskObj.task;
              const color = typeof taskObj === 'string' ? 'gray' : taskObj.priority || 'gray';

              return (
                <li key={index}>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: color,
                      marginRight: '6px',
                    }}
                  ></span>
                  {taskText}
                  <button
                    onClick={() => onDeleteTask(index)}
                    style={{
                      marginLeft: '10px',
                      color: 'red',
                      cursor: 'pointer',
                      background: 'transparent',
                      border: 'none',
                    }}
                  >
                    ✕
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="popup-input">
        <input
          type="text"
          placeholder="New task..."
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
        />
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
