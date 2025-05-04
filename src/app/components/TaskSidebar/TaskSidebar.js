import React from 'react';
import './TaskSidebar.css';

const TaskSidebar = ({ dateKey, tasks, onDeleteTask }) => {
    return (
        <div className="task-sidebar">
            <h3>Tasks for {dateKey || '...'}</h3>
            {tasks && tasks.length > 0 ? (
                <ul className="task-list">
                    {tasks.map((task, index) => (
                        <li key={index} className={`task-item ${task.type}`}>
                            <div className="task-dot" style={{ backgroundColor: task.priority }}></div>
                            <div className="task-content">
                                <div className="task-name">{task.task}</div>
                                {task.type === 'event' && (
                                    <div className="task-time">{task.startTime} - {task.endTime}</div>
                                )}
                                <div className="task-badge">{task.type.toUpperCase()}</div>
                            </div>
                            <button
                                className="task-delete"
                                onClick={() => {
                                    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
                                    if (confirmDelete) {
                                        onDeleteTask(index);
                                    }
                                }}
                            >
                                ✕
                            </button>            </li>
                    ))}
                </ul>
            ) : (
                <p>No tasks selected</p>
            )}
        </div>
    );
};

export default TaskSidebar;
