import React, { useState } from 'react';
import { DevicePhoneMobileIcon } from '@heroicons/react/24/solid';

interface PhoneNumberSetupModalProps {
  isOpen: boolean;
  onSubmit: (phoneNumber: string) => void;
}

const PhoneNumberSetupModal: React.FC<PhoneNumberSetupModalProps> = ({ isOpen, onSubmit }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedPhoneNumber = phoneNumber.trim();
    if (!trimmedPhoneNumber) {
      setError('Phone number is required.');
      return;
    }
    // Regex for Indian phone numbers: optional +91, then optional space/hyphen, then 10 digits starting with 6, 7, 8, or 9
    if (!/^(?:\+91[\-\s]?)?[6-9]\d{9}$/.test(trimmedPhoneNumber)) {
      setError('Please enter a valid 10-digit Indian phone number, optionally starting with +91.');
      return;
    }
    onSubmit(trimmedPhoneNumber);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-rose-900 via-purple-900 to-rose-950 flex items-center justify-center p-4 z-50">
      <div className="bg-rose-800 p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 scale-100">
        <div className="flex flex-col items-center mb-6">
          <DevicePhoneMobileIcon className="h-12 w-12 text-pink-400 mb-3" />
          <h2 className="text-2xl font-semibold text-pink-300 text-center">Setup Your Reminder Number</h2>
          <p className="text-sm text-rose-300 mt-2 text-center">
            Please enter your WhatsApp phone number. This will be used to pre-fill reminders.
          </p>
        </div>
        {error && <p className="text-red-300 bg-red-800 p-3 rounded-md mb-4 text-sm text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="setupPhoneNumber" className="block text-sm font-medium text-rose-200 mb-1">
              Your WhatsApp Phone Number
            </label>
            <input
              type="tel"
              id="setupPhoneNumber"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                if (error) setError(''); 
              }}
              className="w-full p-3 bg-rose-700 border border-rose-600 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-white placeholder-rose-400 text-lg"
              placeholder="e.g., +91 9876543210 or 9876543210"
              required
              aria-describedby="phone-format-hint"
            />
            <p id="phone-format-hint" className="text-xs text-rose-400 mt-1">Enter a 10-digit Indian number, e.g., 9876543210. You can include +91.</p>
          </div>
          
          <button
            type="submit"
            className="w-full px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-md shadow-md transition-colors text-lg"
          >
            Save and Continue
          </button>
        </form>
         <p className="text-xs text-rose-400 mt-6 text-center">
            This number is stored locally in your browser and is only used for simulating reminders within this app.
        </p>
      </div>
    </div>
  );
};

export default PhoneNumberSetupModal;