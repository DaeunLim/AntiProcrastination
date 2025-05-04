import React, { useState } from 'react';
import './MainCalendar.css';
import PopupBox from '../PopupBox/PopupBox';
import MiddlePopupBox from "../middlePopupBox/middlePopupBox";
import { useNavigate } from 'react-router-dom';
import TaskSidebar from '../TaskSidebar/TaskSidebar';

const MainCalendar = ({ month, year, taskByDate, setTaskByDate }) => {

  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(null);
  const [popupBox, setPopupBox] = useState({ x: 0, y: 0 });
  const [middlePopup, setMiddlePopup] = useState(false);


  // Function to get the first day of the month (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay(); // getDay() returns the day of the week (0 - Sunday, 6 - Saturday)
  };

  // Function to get the number of days in a month
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate(); // Last day of the month
  };

  const isToday = (day, month, year) => {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
  };

  // Generate the dates of the month
  const generateCalendarDays = (month, year) => {
    const firstDay = getFirstDayOfMonth(year, month);
    const daysInMonth = getDaysInMonth(month, year);

    // Create an array of all the days to display
    let daysArray = [];

    // Add empty days for the first row (if the month doesn't start on Sunday)
    for (let i = 0; i < firstDay; i++) {
      daysArray.push(null); // Empty day (used for the blank spaces before the 1st of the month)
    }

    // Add actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      daysArray.push(day);
    }

    // Add empty days for the last row (if the month doesn't end on Saturday)
    while (daysArray.length % 7 !== 0) {
      daysArray.push(null); // Fill with null to make the rows even
    }

    return daysArray;
  };

  const daysArray = generateCalendarDays(month, year);

  // Weekdays array (for display)
  const weekdays = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
  const getDateKey = (day, month, year) => `${year}-${month + 1}-${day}`;


  const handleDayClick = (day, event, index) => {
    if (!day) return;
    const isLastRow = Math.floor(index / 7) === Math.floor((daysArray.length - 1) / 7);

    const popupHeight = 120; // 🔧 estimated height of the popup (adjust if needed)
    const verticalOffset = 8;

    const rect = event.target.getBoundingClientRect();
    const popUpBox = isLastRow
      ? rect.top + window.scrollY - popupHeight - verticalOffset
      : rect.bottom + window.scrollY + verticalOffset;

    setPopupBox({
      x: rect.left + window.scrollX,
      y: popUpBox,
    });

    setSelectedDate({ day, month, year });

  };

  const handleAddingTask = (dateKey, task) => {
    setTaskByDate((prev) => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), task],
    }));
  };

  const handleDeletingTask = (dateKey, taskIndex) => {
    setTaskByDate((prev) => {
      const updatedTasks = [...(prev[dateKey] || [])];
      updatedTasks.splice(taskIndex, 1);
      return { ...prev, [dateKey]: updatedTasks };
    });
  };

  const getDate = (day, month, year) => `${year}-${month + 1}-${day}`;
  const closeBox = () => setSelectedDate(null);

  const handleBackClick = () => {
    navigate('/home'); // Navigates to the home page (replace '/' with the actual path of your home page if it's different)
  };

  return (
    <div className="main-page">
      <div className="main-calendar">
        <button className="back-button" onClick={handleBackClick}>&#60;
          <span className="back-text">home</span>
        </button>
        <div className="main-calendar-header">
          <span>{`${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`}</span>
        </div>
        <div className="main-calendar-weekdays">
          {weekdays.map((weekday) => (
            <div key={weekday} className="main-calendar-weekday">
              {weekday}
            </div>
          ))}
        </div>
        <div className="main-calendar-days">
          {daysArray.map((day, index) => {
            const dateKey = day ? getDate(day, month, year) : null;
            const tasks = dateKey ? taskByDate[dateKey] : [];
            return (
              <div key={index}
                className={`main-calendar-day ${day ? '' : 'empty'} ${day && isToday(day, month, year) ? 'today' : ''}`}
                onClick={(e) => handleDayClick(day, e, index)}
              >
                {day}
                {tasks?.length > 0 && (
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
                        {taskObj.task}
                        {taskObj.type === 'event' && ` (${taskObj.startTime}-${taskObj.endTime})`}
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
      <TaskSidebar
      dateKey={selectedDate ? getDate(selectedDate.day, selectedDate.month, selectedDate.year) : null}
      tasks={selectedDate ? taskByDate[getDate(selectedDate.day, selectedDate.month, selectedDate.year)] : []}
      onDeleteTask={(indexToDelete) => {
        const dateKey = getDate(selectedDate.day, selectedDate.month, selectedDate.year);
        const updatedTasks = [...(taskByDate[dateKey] || [])];
        updatedTasks.splice(indexToDelete, 1);
        setTaskByDate((prev) => ({
          ...prev,
          [dateKey]: updatedTasks,
        }));
      }}
    />
      {selectedDate && (
        <PopupBox
          day={selectedDate.day}
          month={selectedDate.month}
          year={selectedDate.year}
          position={popupBox}
          onClose={() => setSelectedDate(null)}
          tasks={taskByDate[getDateKey(selectedDate.day, selectedDate.month, selectedDate.year)] || []}
          onAddTask={(taskObj) =>
            handleAddingTask(getDateKey(selectedDate.day, selectedDate.month, selectedDate.year), taskObj)
          }
          onDeleteTask={(indexToDelete) => {
            const dateKey = getDate(selectedDate.day, selectedDate.month, selectedDate.year);
            const updatedTasks = [...(taskByDate[dateKey] || [])];
            updatedTasks.splice(indexToDelete, 1);
            setTaskByDate((prev) => ({
              ...prev,
              [dateKey]: updatedTasks,
            }));
          }}
        />
      )}
      {middlePopup && (
        <MiddlePopupBox
          onAddTask={(dateStr, taskObj) => {
            // Normalize the date to match your key format (YYYY-M-D)
            const date = new Date(dateStr);
            const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

            setTaskByDate((prev) => ({
              ...prev,
              [key]: [...(prev[key] || []), taskObj],
            }));
          }}
          onClose={() => setMiddlePopup(false)}
        />
      )}
      <button onClick={() => setMiddlePopup(true)} className="open-middle-popup">+</button>

    </div>


  );
};

export default MainCalendar;
