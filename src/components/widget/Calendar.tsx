import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { isToday } from '../utils/Utils'; // 날짜 유틸리티 함수 임포트
import '../css/Calendar.css'; // 필요한 스타일 정의

interface DayData {
  date: dayjs.Dayjs;
  events: string[]; // 각 날짜에 표시할 이벤트 배열
}

const Calendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [days, setDays] = useState<DayData[]>([]);

  useEffect(() => {
    const startOfMonth = currentMonth.startOf('month').startOf('week'); // 주 시작일로 설정
    const endOfMonth = currentMonth.endOf('month').endOf('week'); // 주 끝일로 설정
    const daysInMonth = [];

    // 임시로 DB에서 데이터를 가져왔다고 가정
    const sampleEvents: { [key: string]: string[] } = {
      '2024-09-05': ['Meeting with client', 'Project deadline'],
      '2024-09-12': ['Team lunch', 'Presentation'],
      '2024-09-20': ['Workshop'],
    };

    for (let day = startOfMonth; day.isBefore(endOfMonth, 'day'); day = day.add(1, 'day')) {
      const formattedDate = day.format('YYYY-MM-DD');
      daysInMonth.push({
        date: day,
        events: sampleEvents[formattedDate] || [], // 해당 날짜의 이벤트 추가
      });
    }

    setDays(daysInMonth);
  }, [currentMonth]);

  const handlePrevMonth = () => setCurrentMonth(currentMonth.subtract(1, 'month'));
  const handleNextMonth = () => setCurrentMonth(currentMonth.add(1, 'month'));

  // 지난달, 이번달, 다음달 구분을 위해 색상 처리
  const getDayClass = (date: dayjs.Dayjs) => {
    const dayOfWeek = date.day();
    const isCurrentMonth = date.month() === currentMonth.month();

    let dayClass = '';

    if (dayOfWeek === 6) dayClass = 'saturday'; // 토요일
    if (dayOfWeek === 0) dayClass = 'sunday'; // 일요일

    if (!isCurrentMonth) {
      dayClass += ' other-month'; // 지난달, 다음달 날짜를 연한 색으로 처리
    }

    return dayClass;
  };

  return (
    <div className="calendar-container">
     
      <div className="calendar-header">
      <button onClick={handlePrevMonth} className="nav-button">{"<"}</button> <span>{currentMonth.format('YYYY년MM')}</span>
      <button onClick={handleNextMonth} className="nav-button">{">"}</button>
      </div>
      
      <div className="calendar-grid">
        {days.map((dayData) => (
          <div
            key={dayData.date.format('YYYY-MM-DD')}
            className={`calendar-cell ${getDayClass(dayData.date)} ${isToday(dayData.date) ? 'today' : ''}`}
          >
            <div className="calendar-date">{dayData.date.date()}</div>
            <div className="calendar-events">
              {dayData.events.length > 0 ? (
                dayData.events.map((event, index) => (
                  <div key={index} className="event-item">{event}</div>
                ))
              ) : (
                <div className="no-events">No Events</div> // 이벤트가 없을 경우 표시
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
