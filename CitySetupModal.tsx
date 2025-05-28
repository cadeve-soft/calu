
import React, { useState } from 'react';
import { MapPinIcon } from '@heroicons/react/24/solid';

interface CitySetupModalProps {
  isOpen: boolean;
  onSubmit: (city: string) => void;
}

const CitySetupModal: React.FC<CitySetupModalProps> = ({ isOpen, onSubmit }) => {
  const [city, setCity] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) {
      setError('City name is required.');
      return;
    }
    onSubmit(city.trim());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-rose-900 via-purple-900 to-rose-950 flex items-center justify-center p-4 z-50">
      <div className="bg-rose-800 p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 scale-100">
        <div className="flex flex-col items-center mb-6">
          <MapPinIcon className="h-12 w-12 text-pink-400 mb-3" />
          <h2 className="text-2xl font-semibold text-pink-300 text-center">Set Your City</h2>
          <p className="text-sm text-rose-300 mt-2 text-center">
            Please enter your city to get daily weather forecasts.
          </p>
        </div>
        {error && <p className="text-red-300 bg-red-800 p-3 rounded-md mb-4 text-sm text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="setupCity" className="block text-sm font-medium text-rose-200 mb-1">
              Your City Name
            </label>
            <input
              type="text"
              id="setupCity"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                if (error) setError(''); 
              }}
              className="w-full p-3 bg-rose-700 border border-rose-600 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-white placeholder-rose-400 text-lg"
              placeholder="e.g., London, New York"
              required
              aria-describedby="city-format-hint"
            />
            <p id="city-format-hint" className="text-xs text-rose-400 mt-1">This helps us fetch local weather for you.</p>
          </div>
          
          <button
            type="submit"
            className="w-full px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-md shadow-md transition-colors text-lg"
          >
            Save City and Continue
          </button>
        </form>
         <p className="text-xs text-rose-400 mt-6 text-center">
            Your city is stored locally in your browser for weather and daily updates.
        </p>
      </div>
    </div>
  );
};

export default CitySetupModal;
