import React, { useState } from 'react';
import './middlePopupBox.css';

const MiddlePopupBox = ({ onAddTask, onClose }) => {
    const [date, setDate] = useState('');
    const [task, setTask] = useState('');
    const [priority, setPriority] = useState('green');

    const handleAddButton = () => {
        if (date && task) {
            onAddTask(date, { task, priority});
            setDate('');
            setTask('');
            setPriority('green');
            onClose();
        }
    };

    return (
        <div className="add-tasks">
            <div className="add-task-title">
                <h3>Add New Task</h3>
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
                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value="red">High (Red)</option>
                    <option value="orange">Medium (Orange)</option>
                    <option value="green">Low (Green)</option>
                </select>
                <button onClick={handleAddButton}>Add</button>
                <button onClick={onClose} className="close-button">Close</button>
            </div>
        </div>
    )
}

export default MiddlePopupBox;