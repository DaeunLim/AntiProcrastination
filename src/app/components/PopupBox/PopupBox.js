import React, {useState} from 'react';
import './PopupBox.css';

const PopupBox = ({ day, month, year, position, onClose, tasks, onAddTask }) => {
  if (!day) return null;

  const [taskInput, setTaskInput] = useState('');

  const handleAddingTask = () => {
    if (taskInput.trim() !== '') {
      onAddTask(taskInput);
      setTaskInput('');
    }
  };

  return (
    <div
      className="date-popup"
      style={{
        position: 'absolute',
        top: position.y + 5,
        left: position.x,
        background: '#FFFDD0',
        width: '300px',
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
            {tasks.map((task, index) => (
              <li key={index}>• {task}</li>
            ))}
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
        <button onClick={handleAddingTask}>Add</button>
      </div>

      <button className="popup-close" onClick={onClose}>Close</button>


      
    </div>
  );
};

export default PopupBox;
