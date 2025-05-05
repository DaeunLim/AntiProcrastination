import React, { useState } from 'react';
import './MainCalendar.css';
import PopupBox from '../PopupBox/PopupBox';
import MiddlePopupBox from "../middlePopupBox/middlePopupBox";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MainCalendar = ({ calendar, taskByDate, onAddTask, onDeleteTask }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(null);
  const [popupBox, setPopupBox] = useState({ x: 0, y: 0 });
  const [middlePopup, setMiddlePopup] = useState(false);

  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

  const isToday = (day, month, year) => {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
  };

  const getUrgencyColor = (dueStr) => {
    const due = new Date(dueStr);
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    if (diff < 0) return 'gray';
    if (diff <= 1) return 'red';
    if (diff <= 3) return 'yellow';
    return 'green';
  };

  const generateCalendarDays = (month, year) => {
    const firstDay = getFirstDayOfMonth(year, month);
    const daysInMonth = getDaysInMonth(month, year);
    let daysArray = [];

    for (let i = 0; i < firstDay; i++) daysArray.push(null);
    for (let day = 1; day <= daysInMonth; day++) daysArray.push(day);
    while (daysArray.length % 7 !== 0) daysArray.push(null);

    return daysArray;
  };

  const daysArray = generateCalendarDays(currentMonth, currentYear);
  const weekdays = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
  const getDate = (day, month, year) => `${year}-${month + 1}-${day}`;

  const handleDayClick = (day, event, index) => {
    if (!day) return;
    const isLastRow = Math.floor(index / 7) === Math.floor((daysArray.length - 1) / 7);

    const popupHeight = 120;
    const verticalOffset = 8;
    const rect = event.target.getBoundingClientRect();
    const popUpBoxY = isLastRow
      ? rect.top + window.scrollY - popupHeight - verticalOffset
      : rect.bottom + window.scrollY + verticalOffset;

    setPopupBox({ x: rect.left + window.scrollX, y: popUpBoxY });
    setSelectedDate({ day, month: currentMonth, year: currentYear });
  };

  const handleAddingTask = async (dateKey, task) => {
    const response = await axios.post(`http://localhost:8080/api/date/add`, {calendar: calendar._id, ...task}, { withCredentials: true });
    console.log(response)
    onAddTask(dateKey, { ...task, _id: response.data._id });
  }
  const handleDeletingTask = (dateKey, index) => onDeleteTask(dateKey, index);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  return (
    <div className="main-page">
      <div className="main-calendar">
        <div className="main-calendar-header">
          <button onClick={handlePrevMonth} className="month-nav">&#8592;</button>
          <span>{`${new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} ${currentYear}`}</span>
          <button onClick={handleNextMonth} className="month-nav">&#8594;</button>
        </div>

        <div className="main-calendar-weekdays">
          {weekdays.map((weekday) => (
            <div key={weekday} className="main-calendar-weekday">{weekday}</div>
          ))}
        </div>

        <div className="main-calendar-days">
          {daysArray.map((day, index) => {
            const dateKey = day ? getDate(day, currentMonth, currentYear) : null;
            const tasks = dateKey ? taskByDate[dateKey] || [] : [];
            return (
              <div
                key={index}
                className={`main-calendar-day ${day ? '' : 'empty'} ${day && isToday(day, currentMonth, currentYear) ? 'today' : ''}`}
                onClick={(e) => handleDayClick(day, e, index)}
              >
                {day}
                {tasks.length > 0 && (
                  <div className="task-view">
                    {tasks.slice(0, 2).map((taskObj, i) => (
                      <div key={i} className="task-bullet">
                        <span
                          style={{
                            display: 'inline-block',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: taskObj.priority || 'gray',
                            marginRight: '6px',
                          }}
                        ></span>
                        {taskObj.name}
                        {taskObj.taskType === 'event' && ` (${taskObj.from}-${taskObj.to})`}
                      </div>
                    ))}
                    {tasks.length > 2 && <div className="more-tasks">+{tasks.length - 2} more</div>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <PopupBox
          day={selectedDate.day}
          month={selectedDate.month}
          year={selectedDate.year}
          position={popupBox}
          onClose={() => setSelectedDate(null)}
          tasks={taskByDate[getDate(selectedDate.day, selectedDate.month, selectedDate.year)] || []}
          onAddTask={(taskObj) => handleAddingTask(getDate(selectedDate.day, selectedDate.month, selectedDate.year), taskObj)}
          onDeleteTask={(indexToDelete) => handleDeletingTask(getDate(selectedDate.day, selectedDate.month, selectedDate.year), indexToDelete)}
        />
      )}

      {middlePopup && (
        <MiddlePopupBox
          onAddTask={(dateStr, taskObj) => {
            const date = new Date(dateStr);
            const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            onAddTask(key, taskObj);
          }}
          onClose={() => setMiddlePopup(false)}
        />
      )}

      <button onClick={() => setMiddlePopup(true)} className="open-middle-popup">+</button>
    </div>
  );
};

export default MainCalendar;
