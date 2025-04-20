import React, { useState } from 'react';
import './TodoList.css';

function TodoList() {
  const [todos, setTodos] = useState([
    { task: 'Task01', due: '2025-04-20', color: 'red', completed: false },
    { task: 'Task02', due: '2025-04-21', color: 'yellow', completed: false },
    { task: 'Task03', due: '2025-04-23', color: 'green', completed: false }
  ]);

  // UI state for new task form
  const [adding, setAdding] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newColor, setNewColor] = useState('green');

  // Editing state
  const [editingIndex, setEditingIndex] = useState(null); // editing date
  const [editingTaskIndex, setEditingTaskIndex] = useState(null); // editing task name
  const [editedTaskName, setEditedTaskName] = useState('');

  // Add a new task
  const handleAddNew = () => {
    if (newTask.trim() && newDate) {
      setTodos([...todos, { task: newTask.trim(), due: newDate, color: newColor, completed: false }]);
      setNewTask('');
      setNewDate('');
      setNewColor('green');
      setAdding(false);
    }
  };

  // Cycle color for new task
  const toggleNewColor = () => {
    setNewColor((prev) =>
      prev === 'green' ? 'yellow' : prev === 'yellow' ? 'red' : 'green'
    );
  };

  // Cycle color for existing task
  const toggleColor = (originalIndex) => {
    const nextColor = { green: 'yellow', yellow: 'red', red: 'green' };
    setTodos((prev) =>
      prev.map((t, i) =>
        i === originalIndex ? { ...t, color: nextColor[t.color] } : t
      )
    );
  };

  // Toggle completion status
  const toggleComplete = (originalIndex) => {
    setTodos((prev) =>
      prev.map((t, i) =>
        i === originalIndex ? { ...t, completed: !t.completed } : t
      )
    );
  };

  // Delete a task
  const deleteTask = (originalIndex) => {
    setTodos((prev) => prev.filter((_, i) => i !== originalIndex));
  };

  // Update task due date
  const updateDate = (originalIndex, newDate) => {
    setTodos((prev) =>
      prev.map((t, i) =>
        i === originalIndex ? { ...t, due: newDate } : t
      )
    );
    setEditingIndex(null);
  };

  // Convert YYYY-MM-DD to MM/DD
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${month}/${day}`;
  };

  // Return sorted todo list:
  // 1. Uncompleted first
  // 2. Red > Yellow > Green
  // 3. Completed tasks last
  const getSortedTodos = () => {
    const colorOrder = { red: 0, yellow: 1, green: 2 };
    return todos
      .map((t, originalIndex) => ({ ...t, originalIndex })) // preserve original index
      .sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return colorOrder[a.color] - colorOrder[b.color];
      });
  };

  return (
    <div className="todo-container">
      <div className="todo-header">
        <h3 className="todo-title">Todo List</h3>
        <button className="add-task-button" onClick={() => setAdding(true)}>+ Add Task</button>
      </div>

      <ul className="todo-list">
        {getSortedTodos().map((item) => (
          <li key={item.originalIndex} className={`todo-box ${item.completed ? 'completed' : ''}`}>
            {/* Show date input or formatted date */}
            {editingIndex === item.originalIndex ? (
              <input
                className="todo-time-input"
                type="date"
                value={item.due}
                onChange={(e) => updateDate(item.originalIndex, e.target.value)}
              />
            ) : (
              <span className="todo-time" onClick={() => setEditingIndex(item.originalIndex)}>
                {formatDate(item.due)}
              </span>
            )}

            {/* Show task input or label */}
            {editingTaskIndex === item.originalIndex ? (
              <input
                className="todo-task-input"
                type="text"
                value={editedTaskName}
                autoFocus
                onChange={(e) => setEditedTaskName(e.target.value)}
                onBlur={() => {
                  if (editedTaskName.trim()) {
                    setTodos((prev) =>
                      prev.map((t, i) => (i === item.originalIndex ? { ...t, task: editedTaskName } : t))
                    );
                  }
                  setEditingTaskIndex(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setTodos((prev) =>
                      prev.map((t, i) => (i === item.originalIndex ? { ...t, task: editedTaskName } : t))
                    );
                    setEditingTaskIndex(null);
                  }
                  if (e.key === 'Escape') setEditingTaskIndex(null);
                }}
              />
            ) : (
              <span
                className="todo-content"
                onClick={() => {
                  setEditingTaskIndex(item.originalIndex);
                  setEditedTaskName(item.task);
                }}
              >
                {item.task}
              </span>
            )}

            {/* Clickable color circle */}
            <span
              className="todo-dot"
              style={{ backgroundColor: item.color }}
              onClick={() => toggleColor(item.originalIndex)}
            />

            {/* Complete & delete buttons */}
            <div className="todo-actions">
              <button onClick={() => toggleComplete(item.originalIndex)}>✔</button>
              <button onClick={() => deleteTask(item.originalIndex)}>X</button>
            </div>
          </li>
        ))}

        {/* New task input row */}
        {adding && (
          <li className="todo-box new-task">
            <input
              className="todo-time-input"
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
            <input
              className="todo-task-input"
              type="text"
              placeholder="New task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <span
              className="todo-dot"
              style={{ backgroundColor: newColor, cursor: 'pointer' }}
              onClick={toggleNewColor}
            />
            <button className="confirm-btn" onClick={handleAddNew}>✔</button>
          </li>
        )}
      </ul>
    </div>
  );
}

export default TodoList;
