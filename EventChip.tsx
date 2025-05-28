import React from 'react';
import { CalendarEvent } from '../types';
import { ClockIcon } from '@heroicons/react/24/outline';


interface EventChipProps {
  event: CalendarEvent;
}

const EventChip: React.FC<EventChipProps> = ({ event }) => {
  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div className={`p-1.5 rounded-md text-xs text-white shadow-sm ${event.color || 'bg-pink-500'} hover:opacity-80 transition-opacity`}>
      <p className="font-semibold truncate" title={event.title}>{event.title}</p>
      <div className="flex items-center text-rose-100 opacity-80">
        <ClockIcon className="h-3 w-3 mr-1" />
        <span>{formatTime(event.time)}</span>
      </div>
    </div>
  );
};

export default EventChip;