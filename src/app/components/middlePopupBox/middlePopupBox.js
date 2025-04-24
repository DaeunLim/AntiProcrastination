import React, { useState } from 'react';
import './middlePopupBox.css';

const MiddlePopupBox = ({ onAddTask, onClose }) => {
    const [date, setDate] = useState('');
    const [task, setTask] = useState('');
    const [priority, setPriority] = useState('green');

    const handleAddButton = () => {
        if (date && task) {
            // 날짜를 YYYY-MM-DD 형식으로 포맷합니다.
            const formattedDate = new Date(date);
            const formattedDateString = formattedDate.toISOString().split('T')[0];  // 2023-04-19 형태로 변환

            // 날짜와 함께 과제를 전달합니다.
            onAddTask(formattedDateString, { task, priority });

            // 입력 필드 초기화
            setDate('');
            setTask('');
            setPriority('green');
            
            // 팝업 닫기
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
                    onChange={(e) => setDate(e.target.value)} // 날짜 변경 시
                />
                <input
                    type="text"
                    placeholder="Task description"
                    value={task}
                    onChange={(e) => setTask(e.target.value)} // 과제 입력 변경 시
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
    );
};

export default MiddlePopupBox;
