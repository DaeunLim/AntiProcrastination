import React, { useState } from 'react';
import './TodoList.css';

function TodoList() {
  const [todos, setTodos] = useState([
    { task: 'Overdue Task', due: '2025-04-21', completed: false },
    { task: 'Task01', due: '2025-04-24', completed: false },
    { task: 'Task02', due: '2025-04-26', completed: false },
    { task: 'Task 03', due: '2025-05-03', completed: false }
  ]);

  const [adding, setAdding] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [newDate, setNewDate] = useState('');
  const [showOverdue, setShowOverdue] = useState(false);

  const [editingTaskIndex, setEditingTaskIndex] = useState(null);
  const [editedTaskText, setEditedTaskText] = useState('');
  const [editingDateIndex, setEditingDateIndex] = useState(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getUrgencyColor = (dueStr) => {
    const due = new Date(dueStr);
    due.setHours(0, 0, 0, 0);
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    if (diff < 0) return 'gray';
    if (diff <= 1) return 'red';
    if (diff <= 3) return 'yellow';
    return 'green';
  };

  const formatDate = (str) => {
    const date = new Date(str);
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
  };

  const getOverdueTodos = () =>
    todos.map((t, i) => ({ ...t, originalIndex: i }))
      .filter(t => new Date(t.due) < today && !t.completed);

  const getUpcomingTodos = () => {
    const colorOrder = { red: 0, yellow: 1, green: 2, gray: 3 };

    // Map todos with index and urgency color
    const mapped = todos.map((t, i) => ({
      ...t,
      originalIndex: i,
      urgencyColor: getUrgencyColor(t.due)
    }));

    // Separate completed and not completed
    const active = mapped.filter(t => new Date(t.due) >= today && !t.completed);
    const done = mapped.filter(t => new Date(t.due) >= today && t.completed);

    // Sort each by urgency color
    active.sort((a, b) => colorOrder[a.urgencyColor] - colorOrder[b.urgencyColor]);
    done.sort((a, b) => colorOrder[a.urgencyColor] - colorOrder[b.urgencyColor]);

    return [...active, ...done];
  };


  const handleAdd = () => {
    if (!newTask.trim() || !newDate) return;
    setTodos([...todos, { task: newTask.trim(), due: newDate, completed: false }]);
    setNewTask('');
    setNewDate('');
    setAdding(false);
  };

  const toggleComplete = (index) => {
    setTodos(prev => prev.map((t, i) => i === index ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (index) => {
    setTodos(prev => prev.filter((_, i) => i !== index));
  };

  const updateTaskText = (index, value) => {
    setTodos(prev => prev.map((t, i) => i === index ? { ...t, task: value } : t));
    setEditingTaskIndex(null);
  };

  const updateTaskDate = (index, value) => {
    setTodos(prev => prev.map((t, i) => i === index ? { ...t, due: value } : t));
    setEditingDateIndex(null);
  };

  const renderTaskRow = (t, index) => (
    <li key={index} className={`todo-box ${t.completed ? 'completed' : ''}`}>
      {editingDateIndex === index ? (
        <input
          type="date"
          className="todo-time-input"
          value={t.due}
          autoFocus
          onChange={(e) => updateTaskDate(index, e.target.value)}
          onBlur={() => setEditingDateIndex(null)}
          onKeyDown={(e) => { if (e.key === 'Escape') setEditingDateIndex(null); }}
        />
      ) : (
        <span className="todo-time" onClick={() => setEditingDateIndex(index)}>
          {formatDate(t.due)}
        </span>
      )}

      {editingTaskIndex === index ? (
        <input
          type="text"
          className="todo-task-input"
          value={editedTaskText}
          autoFocus
          onChange={(e) => setEditedTaskText(e.target.value)}
          onBlur={() => updateTaskText(index, editedTaskText)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') updateTaskText(index, editedTaskText);
            if (e.key === 'Escape') setEditingTaskIndex(null);
          }}
        />
      ) : (
        <span className="todo-content" onClick={() => {
          setEditingTaskIndex(index);
          setEditedTaskText(t.task);
        }}>
          {t.task}
        </span>
      )}

      <span className="todo-dot" style={{ backgroundColor: getUrgencyColor(t.due) }}></span>

      <div className="todo-actions">
        <button onClick={() => toggleComplete(index)}>✔</button>
        <button onClick={() => deleteTask(index)}>X</button>
      </div>
    </li>
  );

  return (
    <div className="todo-container">
      <div className="top-bar">
        <span className="todo-title">Todo List</span>
        <div className="top-actions">
          <button
            className="overdue-toggle"
            onClick={() => setShowOverdue(!showOverdue)}
          >
            {showOverdue ? 'Hide Overdue' : 'Show Overdue'}
          </button>
          <button
            className="add-task-button"
            onClick={() => setAdding(true)}
          >
            + Add Task
          </button>
        </div>
      </div>

      {showOverdue && (
        <div className="overdue-popup">
          <h4>Overdue Tasks</h4>
          <ul className="todo-list">
            {getOverdueTodos().length
              ? getOverdueTodos().map(t => renderTaskRow(t, t.originalIndex))
              : <li className="overdue-none">No overdue tasks</li>}
          </ul>
        </div>
      )}

      <ul className="todo-list">
        {getUpcomingTodos().map(t => renderTaskRow(t, t.originalIndex))}
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
            <button className="confirm-btn" onClick={handleAdd}>✔</button>
          </li>
        )}
      </ul>
    </div>
  );
}

export default TodoList;
