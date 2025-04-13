import React, { useState } from 'react';
import './TodoList.css'; // 

function TodoList() {
  const [currentDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // 'YYYY-MM-DD'
  });

  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-');
    return `${parseInt(month)}/${parseInt(day)}`; // e.g., "4/15"
  };

  const [todos, setTodos] = useState({
    '2025-04-15': ['Buy groceries', 'Call Mom'],
  });

  const [newTask, setNewTask] = useState('');

  const todosForToday = todos[currentDate] || [];

  const handleAddTask = () => {
    if (newTask.trim() === '') return;

    setTodos((prev) => ({
      ...prev,
      [currentDate]: [...(prev[currentDate] || []), newTask.trim()],
    }));

    setNewTask('');
  };

  const handleDeleteTask = (index) => {
    setTodos((prev) => {
      const updated = [...(prev[currentDate] || [])];
      updated.splice(index, 1);
      return {
        ...prev,
        [currentDate]: updated,
      };
    });
  };

  return (
    <div className="todo-container">
      <h3 className="todo-title">Todo List ({formatDate(currentDate)})</h3>

      {todosForToday.length > 0 ? (
        <ul className="todo-list">
          {todosForToday.map((task, index) => (
            <li key={index} className="todo-item">
              <span>{task}</span>
              <button className="delete-btn" onClick={() => handleDeleteTask(index)}>❌</button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-msg">No tasks for today</p>
      )}

      <div className="add-task">
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAddTask();
          }}
        />
        <button onClick={handleAddTask}>Add</button>
      </div>
    </div>
  );
}

export default TodoList;
