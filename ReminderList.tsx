
import React from 'react';
import { AppNotification } from '../types';
import { BellAlertIcon, XCircleIcon } from '@heroicons/react/24/solid';

interface ReminderListProps {
  notifications: AppNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>;
}

const ReminderList: React.FC<ReminderListProps> = ({ notifications, setNotifications }) => {
  
  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Sort notifications by most recent first
  const sortedNotifications = [...notifications].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  if (sortedNotifications.length === 0) { // Check after sorting
    return (
        <div className="mb-6 p-4 bg-rose-700 rounded-lg shadow-md text-rose-300 text-sm text-center">
             No reminders or updates yet.
        </div>
    );
  }

  return (
    <div className="mb-6 p-4 bg-rose-700 rounded-lg shadow-md max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-rose-500 scrollbar-track-rose-600">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-pink-300 flex items-center">
          <BellAlertIcon className="h-6 w-6 mr-2 text-yellow-400" /> {/* Keep yellow for contrast */}
          Notifications
        </h3>
        {notifications.length > 0 && (
            <button 
                onClick={clearAllNotifications}
                className="text-xs text-rose-300 hover:text-pink-400 transition-colors"
                title="Clear all notifications"
            >
                Clear All
            </button>
        )}
      </div>
      <ul className="space-y-2">
        {sortedNotifications.map(notification => (
          <li key={notification.id} className="p-3 bg-rose-600 rounded-md text-sm text-rose-100 flex justify-between items-start">
            <div className="flex-grow">
              <p className="whitespace-pre-line">{notification.message}</p> {/* Allow newlines */}
              <p className="text-xs text-rose-300 mt-1">
                {notification.type === 'daily_summary' ? 'Generated: ' : 'Triggered: '} 
                {notification.timestamp.toLocaleString()}
              </p>
            </div>
            <button 
                onClick={() => clearNotification(notification.id)} 
                className="text-rose-300 hover:text-red-400 transition-colors ml-2 flex-shrink-0" 
                title="Dismiss notification"
            >
                <XCircleIcon className="h-5 w-5"/>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReminderList;
