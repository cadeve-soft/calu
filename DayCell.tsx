import React from 'react';
import { CalendarEvent } from '../types';
import EventChip from './EventChip';

interface DayCellProps {
  date: Date;
  eventsForDay: CalendarEvent[];
  isCurrentMonth: boolean;
  isToday: boolean;
  onClick: () => void;
}

const DayCell: React.FC<DayCellProps> = ({ date, eventsForDay, isCurrentMonth, isToday, onClick }) => {
  let cellClasses = "relative p-2 min-h-[100px] sm:min-h-[120px] transition-colors duration-150 ease-in-out cursor-pointer flex flex-col";
  
  if (isCurrentMonth) {
    cellClasses += " bg-rose-800 hover:bg-rose-700";
  } else {
    cellClasses += " bg-rose-800 opacity-60 hover:bg-rose-700"; // Keep opacity for non-current month days
  }

  if (isToday) {
    cellClasses += " border-2 border-pink-500"; // Highlight today with wine accent
  } else {
     cellClasses += " border border-rose-600"; // Use wine-themed border
  }

  let dateClasses = "text-sm font-medium mb-1 ";
  if (isToday) {
    dateClasses += " text-pink-400 font-bold"; // Wine accent for today's date
  } else if (isCurrentMonth) {
    dateClasses += " text-rose-200"; // Light text for current month
  } else {
    dateClasses += " text-rose-400"; // Dimmer text for other months
  }


  return (
    <div className={cellClasses} onClick={onClick}>
      <span className={dateClasses}>{date.getDate()}</span>
      <div className="space-y-1 overflow-y-auto max-h-[70px] sm:max-h-[80px] flex-grow scrollbar-thin scrollbar-thumb-rose-600 scrollbar-track-rose-700">
        {eventsForDay.slice(0, 3).map(event => ( 
          <EventChip key={event.id} event={event} />
        ))}
        {eventsForDay.length > 3 && (
          <div className="text-xs text-rose-400 mt-1">+{eventsForDay.length - 3} more</div>
        )}
      </div>
    </div>
  );
};

export default DayCell;