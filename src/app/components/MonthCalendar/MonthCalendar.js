// src/components/MonthCalendar.js
import React from 'react';
import './MonthCalendar.css';
import { useNavigate } from 'react-router-dom';

const MonthCalendar = ({ month, year, taskByDate }) => {
  const navigate = useNavigate();
  // Function to get the first day of the month (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay(); // getDay() returns the day of the week (0 - Sunday, 6 - Saturday)
  };

  // Function to get the number of days in a month
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate(); // Last day of the month
  };
  const getDateKey = (day, month, year) => `${year}-${month + 1}-${day}`;

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

  const handleTitleClick = () => {
    navigate('/calendar');  // Navigate to FullCalendarPage when title is clicked
  };

  return (
    <div className="calendar">
      <div onClick={handleTitleClick} className="calendar-header">
        <span>{`${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`}</span>
      </div>
      <div className="calendar-weekdays">
        {weekdays.map((weekday) => (
          <div key={weekday} className="calendar-weekday">
            {weekday}
          </div>
        ))}
      </div>
      <div className="calendar-days">
        {daysArray.map((day, index) => {
          const dateKey = day ? getDateKey(day, month, year) : null;
          const tasks = dateKey ? taskByDate[dateKey] || [] : [];
          return (
            <div key={index} className={`calendar-day ${day ? '' : 'empty'}`}>
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
                      {taskObj.task}
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
  );
};

export default MonthCalendar;
