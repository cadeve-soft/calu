
import React from 'react';
import { WeatherData } from '../types';
import { ArrowPathIcon, MapPinIcon } from '@heroicons/react/24/outline';

interface WeatherDisplayProps {
  weatherData: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  onUpdateCity: () => void;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weatherData, isLoading, error, onUpdateCity }) => {
  return (
    <div className="mb-6 p-4 bg-rose-700 rounded-lg shadow-md text-rose-100">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-pink-300 flex items-center">
          <MapPinIcon className="h-5 w-5 mr-2 text-pink-300" />
          Today's Weather {weatherData?.city ? `in ${weatherData.city}` : ''}
        </h3>
        <button 
          onClick={onUpdateCity} 
          className="text-xs text-rose-300 hover:text-pink-400 transition-colors underline"
          title="Change your city"
        >
          Change City
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-3">
          <ArrowPathIcon className="h-6 w-6 animate-spin mr-2" />
          <p>Loading weather...</p>
        </div>
      )}
      {error && !isLoading && (
         <div className="text-center py-3">
            <p className="text-red-300">⚠️ {error}</p>
            <p className="text-sm text-rose-400 mt-1">Please check the city name or try again.</p>
        </div>
      )}
      {weatherData && !isLoading && !error && (
        <div className="flex items-center justify-around text-center">
          <div className="text-4xl">{weatherData.icon || '❓'}</div>
          <div>
            <p className="text-2xl font-bold">{weatherData.minTemp}°C / {weatherData.maxTemp}°C</p>
            <p className="text-sm text-rose-300">{weatherData.description}</p>
          </div>
        </div>
      )}
      {!weatherData && !isLoading && !error && (
        <p className="text-center text-rose-400 py-3">Weather information will appear here once your city is set.</p>
      )}
    </div>
  );
};

export default WeatherDisplay;
