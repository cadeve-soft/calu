import React from 'react';
import { CalendarEvent } from '../types';
import DayCell from './DayCell';

interface CalendarGridProps {
  currentDate: Date;
  events: CalendarEvent[];
  onDayClick: (date: Date) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ currentDate, events, onDayClick }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const daysInMonth = [];
  const today = new Date();
  today.setHours(0,0,0,0); // Normalize today for comparison

  // Days from previous month
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) - 6 (Sat)
  for (let i = 0; i < startDayOfWeek; i++) {
    const date = new Date(year, month, 1 - (startDayOfWeek - i));
    daysInMonth.push({ date, isCurrentMonth: false });
  }

  // Days in current month
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    const date = new Date(year, month, i);
    daysInMonth.push({ date, isCurrentMonth: true });
  }

  // Days from next month to fill grid (typically 6 weeks = 42 cells)
  const remainingCells = 42 - daysInMonth.length; // Assuming 6 weeks grid
  for (let i = 1; i <= remainingCells; i++) {
    const date = new Date(year, month + 1, i);
    daysInMonth.push({ date, isCurrentMonth: false });
  }
  
  // Ensure grid is always 6 weeks (42 cells) long if not already
   while (daysInMonth.length < 42) {
    const lastDateInGrid = daysInMonth[daysInMonth.length-1].date;
    const nextDate = new Date(lastDateInGrid);
    nextDate.setDate(lastDateInGrid.getDate() + 1);
     daysInMonth.push({ date: nextDate, isCurrentMonth: false });
   }


  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="grid grid-cols-7 gap-px bg-rose-700 border border-rose-600 rounded-md overflow-hidden">
      {daysOfWeek.map(day => (
        <div key={day} className="text-center font-medium py-3 bg-rose-700 text-pink-200 text-sm">
          {day}
        </div>
      ))}
      {daysInMonth.map(({ date, isCurrentMonth }, index) => {
        const dateString = date.toISOString().split('T')[0];
        const eventsForDay = events.filter(event => event.date === dateString);
        const isToday = date.toDateString() === today.toDateString();
        
        return (
          <DayCell
            key={index}
            date={date}
            eventsForDay={eventsForDay}
            isCurrentMonth={isCurrentMonth}
            isToday={isToday}
            onClick={() => onDayClick(date)}
          />
        );
      })}
    </div>
  );
};

export default CalendarGrid;