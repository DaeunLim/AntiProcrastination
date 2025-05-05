import React, { useState, useEffect } from 'react';
import './TodoList.css';

function TodoList({ selectedDate, taskByDate, setTaskByDate, onDeleteTask }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getUrgencyColor = (time) => {
    const due = new Date(time);
    due.setHours(0, 0, 0, 0);
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    if (diff < 0) return 'gray';
    if (diff <= 1) return 'red';
    if (diff <= 3) return 'yellow';
    return 'green';
  };


  const getCalendarTasks = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const tasks = Object.entries(taskByDate || {})
      .flatMap(([key, taskList]) => {
        const [y, m] = key.split('-').map(Number);
        if (y === currentYear && m - 1 === currentMonth) {
          return taskList.map((t, i) => ({
            ...t,
            date: key,
            taskIndex: i,
            due: t.due || key
          }))
        }
        return [];
      });

    return tasks.sort((a, b) => {
      const colors = { red: 0, yellow: 1, green: 2, gray: 3 };
      return colors[getUrgencyColor(a.due)] - colors[getUrgencyColor(b.due)];
    });
  };

  const formatDate = (str) => {
    const date = new Date(str);
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;

  };


  return (
    <div className="todo-container">
      <div className="top-bar">
        <span className="todo-title">Todo List</span>
      </div>

      <ul className="todo-list">
        {getCalendarTasks().map((task, index) => (
          <li key={index} className="todo-box">
            <span className="todo-time">{formatDate(task.date)}</span>

            <div className="todo-content">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="task-name">{task.name}</span>
                <span className="task-badge">{task.taskType}</span>
              </div>
              {task.taskType === 'event' && (
                <div className="task-time">{task.from} - {task.to}</div>
              )}
            </div>

            <span className="todo-dot" style={{ backgroundColor: task.priority || getUrgencyColor(task.due) }}></span>

            <div className="todo-actions">
              <button
                className="task-delete"
                onClick={() => {
                  const confirmDelete = window.confirm("Are you sure you want to delete this task?");
                  if (confirmDelete) {
                    onDeleteTask(task.dateKey, task.taskIndex, task._id); // Pass correct info!
                  }
                }}
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
