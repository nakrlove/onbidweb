// src/components/DateCell.tsx

import React from 'react';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';

dayjs.extend(isToday);

interface DateCellProps {
  date: dayjs.Dayjs;
}

const UIDateCell: React.FC<DateCellProps> = ({ date }) => {
  const isWeekend = date.day() === 6 || date.day() === 0; // 토요일(6) 또는 일요일(0) 확인
  const today = dayjs().isSame(date, 'day');

  let cellClass = '';
  if (today) {
    cellClass = 'day-today';
  } else if (date.day() === 6) {
    cellClass = 'day-saturday';
  } else if (date.day() === 0) {
    cellClass = 'day-sunday';
  }

  return (
    <div className={`date-cell ${cellClass}`}>
      {date.date()}
    </div>
  );
};

export default UIDateCell;
