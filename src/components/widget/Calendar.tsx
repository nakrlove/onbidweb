import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { isToday } from '../utils/Utils'; // 날짜 유틸리티 함수 임포트
import '../css/Calendar.css';

interface DayData {
  date: dayjs.Dayjs;
  events: string[];
}

const Calendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [days, setDays] = useState<DayData[]>([]);

  useEffect(() => {
    const startOfMonth = currentMonth.startOf('month');
    const endOfMonth = currentMonth.endOf('month');
    const daysInMonth = [];

    for (let day = startOfMonth; day.isBefore(endOfMonth, 'day'); day = day.add(1, 'day')) {
      daysInMonth.push({
        date: day,
        events: [], // 여기에 DB에서 가져온 데이터 추가
      });
    }

    setDays(daysInMonth);
  }, [currentMonth]);

  const handlePrevMonth = () => setCurrentMonth(currentMonth.subtract(1, 'month'));
  const handleNextMonth = () => setCurrentMonth(currentMonth.add(1, 'month'));

  const getDayClass = (date: dayjs.Dayjs) => {
    const dayOfWeek = date.day();
    if (dayOfWeek === 6) return 'saturday'; // 토요일
    if (dayOfWeek === 0) return 'sunday';   // 일요일
    return '';
  };

  return (
    <div className="calendar-container">
      <button onClick={handlePrevMonth} className="nav-button">Previous</button>
      <div className="calendar-header">
        <span>{currentMonth.format('MMMM YYYY')}</span>
      </div>
      <button onClick={handleNextMonth} className="nav-button">Next</button>
      <div className="calendar-grid">
        {days.map((dayData) => (
          <div
            key={dayData.date.format('YYYY-MM-DD')}
            className={`calendar-cell ${getDayClass(dayData.date)} ${isToday(dayData.date) ? 'today' : ''}`}
          >
            <div className="calendar-date">{dayData.date.date()}</div>
            <div className="calendar-events">
              {dayData.events.length > 0 ? (
                dayData.events.map((event, index) => <div key={index}>{event}</div>)
              ) : (
                <div>No Events</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
