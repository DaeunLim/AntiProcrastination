import React, { useState } from 'react';
import './middlePopupBox.css';

const MiddlePopupBox = ({ onAddTask, onClose }) => {
  // State for form inputs
  const [date, setDate] = useState('');
  const [task, setTask] = useState('');
  const [type, setType] = useState('assignment');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Today's date (for priority calculation)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Automatically determine priority based on due date
  const getUrgencyColor = (dueStr) => {
    const due = new Date(dueStr);
    due.setHours(0, 0, 0, 0);
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    if (diff < 0) return 'gray';
    if (diff <= 1) return 'red';
    if (diff <= 3) return 'yellow';
    return 'green';
  };

  // Handle task addition
  const handleAddButton = () => {
    if (date && task) {
      // Format date as YYYY-MM-DD
      const formattedDate = new Date(date);
      const formattedDateString = formattedDate.toISOString().split('T')[0];

      // Calculate priority automatically
      const autoPriority = getUrgencyColor(formattedDateString);

      // Add task using parent callback
      onAddTask(formattedDateString, {
        task,
        type,
        due: formattedDateString,
        priority: autoPriority,
        ...(type === 'event' ? { startTime, endTime } : {})
      });

      // Reset form fields and close popup
      setDate('');
      setTask('');
      setType('assignment');
      setStartTime('');
      setEndTime('');
      onClose();
    }
  };

  return (
    <div className="add-tasks">
      <div className="add-task-title">
        <h3>Add New Task</h3>

        {/* Task form inputs */}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Task description"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />

        {/* Task type selector */}
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="assignment">Assignment</option>
          <option value="event">Event</option>
        </select>

        {/* Show time inputs only for 'event' */}
        {type === 'event' && (
          <>
            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </>
        )}

        {/* Buttons */}
        <button onClick={handleAddButton}>Add</button>
        <button onClick={onClose} className="close-button">Close</button>
      </div>
    </div>
  );
};

export default MiddlePopupBox;
