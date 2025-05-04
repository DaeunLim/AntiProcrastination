import React, { useState } from 'react';
import './middlePopupBox.css';

const MiddlePopupBox = ({ onAddTask, onClose }) => {
    const [date, setDate] = useState('');
    const [task, setTask] = useState('');
    const [priority, setPriority] = useState('green');
    const [type, setType] = useState('assignment');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const handleAddButton = () => {
        if (date && task) {
            // YYYY-MM-DD 
            const formattedDate = new Date(date);
            const formattedDateString = formattedDate.toISOString().split('T')[0];  // 2023-04-19 형태로 변환

            onAddTask(formattedDate, {
                task,
                priority,
                type,
                ...(type === 'event' ? { startTime, endTime } : {}),
            });


            setDate('');
            setTask('');
            setPriority('green');
            setType('assignment');
            setStartTime('');
            setEndTime('');
            //close popup
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
                    onChange={(e) => setDate(e.target.value)} // 
                />
                <input
                    type="text"
                    placeholder="Task description"
                    value={task}
                    onChange={(e) => setTask(e.target.value)} // 
                />
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="assignment">Assignment</option>
                    <option value="event">Event</option>
                </select>
                {type === 'event' && (
                    <>
                        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                        <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                    </>
                )}
                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value="red">High</option>
                    <option value="orange">Medium</option>
                    <option value="green">Low</option>
                </select>
                <button onClick={handleAddButton}>Add</button>
                <button onClick={onClose} className="close-button">Close</button>
            </div>
        </div>
    );
};

export default MiddlePopupBox;
