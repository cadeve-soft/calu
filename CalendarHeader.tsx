import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, CalendarDaysIcon, PlusIcon } from '@heroicons/react/24/solid';

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onAddEventClick: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onToday,
  onAddEventClick
}) => {
  const monthYear = currentDate.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
  });

  return (
    <div className="flex items-center justify-between p-4 mb-4 bg-rose-700 rounded-md shadow">
      <div className="flex items-center space-x-2">
        <button
          onClick={onToday}
          className="p-2 rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 transition-colors"
          aria-label="Go to Today"
        >
          <CalendarDaysIcon className="h-6 w-6 text-pink-300" />
        </button>
        <button
          onClick={onPrevMonth}
          className="p-2 rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 transition-colors"
          aria-label="Previous Month"
        >
          <ChevronLeftIcon className="h-6 w-6 text-pink-300" />
        </button>
        <button
          onClick={onNextMonth}
          className="p-2 rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 transition-colors"
          aria-label="Next Month"
        >
          <ChevronRightIcon className="h-6 w-6 text-pink-300" />
        </button>
      </div>
      <h2 className="text-xl font-semibold text-rose-100">{monthYear}</h2>
      <button
        onClick={onAddEventClick}
        className="flex items-center space-x-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-75 transition-colors"
        aria-label="Add New Event"
      >
        <PlusIcon className="h-5 w-5" />
        <span>Add Event</span>
      </button>
    </div>
  );
};

export default CalendarHeader;