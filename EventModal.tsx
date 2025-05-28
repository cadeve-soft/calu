import React, { useState, useEffect } from 'react';
import { CalendarEvent } from '../types';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (eventData: Omit<CalendarEvent, 'id' | 'notified' | 'color'>) => void;
  initialDate: Date | null;
  defaultPhoneNumber?: string | null; 
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSubmit, initialDate, defaultPhoneNumber }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [whatsAppMessage, setWhatsAppMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      const targetDate = initialDate || today;
      
      const year = targetDate.getFullYear();
      const month = (targetDate.getMonth() + 1).toString().padStart(2, '0');
      const day = targetDate.getDate().toString().padStart(2, '0');
      setDate(`${year}-${month}-${day}`);

      setTime(initialDate ? '09:00' : today.toTimeString().substring(0,5)); // HH:MM
      setTitle('');
      setWhatsAppMessage('');
      setPhoneNumber(defaultPhoneNumber || ''); 
      setError('');
    }
  }, [isOpen, initialDate, defaultPhoneNumber]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date || !time || !whatsAppMessage.trim()) {
      setError('Title, Date, Time, and WhatsApp Message fields are required.');
      return;
    }
    if (!/^\d{2}:\d{2}$/.test(time)) {
        setError('Invalid time format. Please use HH:MM.');
        return;
    }
    const trimmedPhoneNumber = phoneNumber.trim();
    if (trimmedPhoneNumber && !/^(?:\+91[\-\s]?)?[6-9]\d{9}$/.test(trimmedPhoneNumber)) {
        setError('Invalid Indian phone number. Please use a 10-digit number, optionally with +91, or leave it blank.');
        return;
    }
    onSubmit({ title, date, time, whatsAppMessage, phoneNumber: trimmedPhoneNumber || undefined });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300">
      <div className="bg-rose-800 p-6 rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 scale-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-pink-400">Add New Event</h2>
          <button onClick={onClose} className="text-rose-300 hover:text-pink-400 transition-colors">
            <XMarkIcon className="h-7 w-7" />
          </button>
        </div>
        {error && <p className="text-red-200 bg-red-800 p-3 rounded-md mb-4 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-rose-200 mb-1">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-rose-700 border border-rose-600 rounded-md focus:ring-pink-500 focus:border-pink-500 text-white placeholder-rose-400"
              placeholder="Event Title"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-rose-200 mb-1">Date</label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 bg-rose-700 border border-rose-600 rounded-md focus:ring-pink-500 focus:border-pink-500 text-white "
                style={{colorScheme: 'dark'}}
                required
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-rose-200 mb-1">Time</label>
              <input
                type="time"
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-3 bg-rose-700 border border-rose-600 rounded-md focus:ring-pink-500 focus:border-pink-500 text-white"
                style={{colorScheme: 'dark'}}
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-rose-200 mb-1">WhatsApp Phone Number (Optional)</label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-3 bg-rose-700 border border-rose-600 rounded-md focus:ring-pink-500 focus:border-pink-500 text-white placeholder-rose-400"
              placeholder="e.g., +91 9876543210 or 9876543210"
            />
          </div>
          <div>
            <label htmlFor="whatsAppMessage" className="block text-sm font-medium text-rose-200 mb-1">WhatsApp Reminder Message</label>
            <textarea
              id="whatsAppMessage"
              value={whatsAppMessage}
              onChange={(e) => setWhatsAppMessage(e.target.value)}
              rows={3}
              className="w-full p-3 bg-rose-700 border border-rose-600 rounded-md focus:ring-pink-500 focus:border-pink-500 text-white placeholder-rose-400"
              placeholder="Your reminder message..."
              required
            />
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-rose-100 bg-rose-600 hover:bg-rose-500 rounded-md font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-md shadow-md transition-colors"
            >
              Add Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;