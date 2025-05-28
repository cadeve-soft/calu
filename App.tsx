
import React, { useState, useEffect, useCallback } from 'react';
import { CalendarEvent, AppNotification, Coordinates, WeatherData } from './types';
import CalendarHeader from './components/CalendarHeader';
import CalendarGrid from './components/CalendarGrid';
import EventModal from './components/EventModal';
import ReminderList from './components/ReminderList';
import PhoneNumberSetupModal from './components/PhoneNumberSetupModal';
import CitySetupModal from './components/CitySetupModal';
import WeatherDisplay from './components/WeatherDisplay';

// WMO Weather code descriptions and simple icons
const WMO_WEATHER_CODES: { [key: number]: { description: string; icon: string } } = {
  0: { description: 'Clear sky', icon: '☀️' },
  1: { description: 'Mainly clear', icon: '🌤️' },
  2: { description: 'Partly cloudy', icon: '🌥️' },
  3: { description: 'Overcast', icon: '☁️' },
  45: { description: 'Fog', icon: '🌫️' },
  48: { description: 'Depositing rime fog', icon: '🌫️❄️' },
  51: { description: 'Light drizzle', icon: '🌦️' },
  53: { description: 'Moderate drizzle', icon: '🌦️' },
  55: { description: 'Dense drizzle', icon: '🌧️' },
  56: { description: 'Light freezing drizzle', icon: '🌦️❄️' },
  57: { description: 'Dense freezing drizzle', icon: '🌧️❄️' },
  61: { description: 'Slight rain', icon: '🌦️' },
  63: { description: 'Moderate rain', icon: '🌧️' },
  65: { description: 'Heavy rain', icon: '🌧️☔' },
  66: { description: 'Light freezing rain', icon: '🌧️❄️' },
  67: { description: 'Heavy freezing rain', icon: '🌧️❄️' },
  71: { description: 'Slight snow fall', icon: '🌨️' },
  73: { description: 'Moderate snow fall', icon: '🌨️❄️' },
  75: { description: 'Heavy snow fall', icon: '❄️☃️' },
  77: { description: 'Snow grains', icon: '❄️' },
  80: { description: 'Slight rain showers', icon: '🌦️' },
  81: { description: 'Moderate rain showers', icon: '🌧️' },
  82: { description: 'Violent rain showers', icon: '⛈️' },
  85: { description: 'Slight snow showers', icon: '🌨️' },
  86: { description: 'Heavy snow showers', icon: '❄️☃️' },
  95: { description: 'Thunderstorm', icon: '⛈️' },
  96: { description: 'Thunderstorm with slight hail', icon: '⛈️雹' },
  99: { description: 'Thunderstorm with heavy hail', icon: '⛈️雹' },
};


const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const savedEvents = localStorage.getItem('calendarAppEvents');
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents);
        return Array.isArray(parsedEvents) ? parsedEvents : [];
      } catch (e) {
        console.error("Failed to parse saved events from localStorage:", e);
        return [];
      }
    }
    return [];
  });
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedDateForModal, setSelectedDateForModal] = useState<Date | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const savedNotifications = localStorage.getItem('calendarAppNotifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        if (Array.isArray(parsed)) {
          return parsed.map((n: any) => ({ ...n, timestamp: new Date(n.timestamp) }));
        }
        console.error("Saved notifications is not an array:", parsed);
        return [];
      } catch (e) {
        console.error("Failed to parse saved notifications from localStorage:", e);
        return [];
      }
    }
    return [];
  });

  const [userPhoneNumber, setUserPhoneNumber] = useState<string | null>(null);
  const [isPhoneNumberSetupModalOpen, setIsPhoneNumberSetupModalOpen] = useState(false);
  const [isLoadingInitialSetup, setIsLoadingInitialSetup] = useState(true);

  // City and Weather state
  const [userCity, setUserCity] = useState<string | null>(null);
  const [isCitySetupModalOpen, setIsCitySetupModalOpen] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  
  const eventColors = ['bg-pink-600', 'bg-rose-600', 'bg-purple-600', 'bg-red-600', 'bg-fuchsia-600', 'bg-indigo-600'];

  // Load initial setup data
  useEffect(() => {
    const storedPhoneNumber = localStorage.getItem('userWhatsAppPhoneNumber');
    const storedCity = localStorage.getItem('userAppCity');

    if (storedPhoneNumber) {
      setUserPhoneNumber(storedPhoneNumber);
      if (storedCity) {
        setUserCity(storedCity);
        setIsLoadingInitialSetup(false);
      } else {
        setIsCitySetupModalOpen(true); // Open city setup if phone number exists but city doesn't
        setIsLoadingInitialSetup(false); // Stop initial loading, city setup will handle flow
      }
    } else {
      setIsPhoneNumberSetupModalOpen(true); // Open phone setup first
      setIsLoadingInitialSetup(false); // Stop initial loading, phone setup will handle flow
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('calendarAppEvents', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('calendarAppNotifications', JSON.stringify(notifications));
  }, [notifications]);

  const handleSetUserPhoneNumber = (phoneNumber: string) => {
    setUserPhoneNumber(phoneNumber);
    localStorage.setItem('userWhatsAppPhoneNumber', phoneNumber);
    setIsPhoneNumberSetupModalOpen(false);
    // If city isn't set up yet, open city setup modal
    if (!userCity) {
      setIsCitySetupModalOpen(true);
    }
  };

  const handleSetUserCity = (city: string) => {
    setUserCity(city);
    localStorage.setItem('userAppCity', city);
    setIsCitySetupModalOpen(false);
    setWeatherData(null); // Clear old weather data
    setWeatherError(null);
  };

  const fetchCoordinates = useCallback(async (city: string): Promise<Coordinates | null> => {
    try {
      const response = await fetch(`https://geocode.maps.co/search?q=${encodeURIComponent(city)}`);
      if (!response.ok) {
        const errorText = response.statusText || `HTTP status ${response.status}`;
        throw new Error(`Geocoding API error: ${errorText}`);
      }
      const data = await response.json();
      if (data && data.length > 0) {
        return { latitude: parseFloat(data[0].lat), longitude: parseFloat(data[0].lon) };
      }
      throw new Error('City not found or geocoding failed.');
    } catch (error) {
      console.error("Geocoding error:", error);
      setWeatherError((error as Error).message || 'Failed to get coordinates for the city.');
      return null;
    }
  }, []);
  
  const fetchWeather = useCallback(async (coords: Coordinates, cityForWeather: string) => {
    setIsWeatherLoading(true);
    setWeatherError(null);
    try {
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`);
      if (!response.ok) {
        const errorText = response.statusText || `HTTP status ${response.status}`;
        throw new Error(`Weather API error: ${errorText}`);
      }
      const data = await response.json();
      
      if (data && data.daily && data.daily.time && data.daily.time.length > 0) {
        const weatherInfo = WMO_WEATHER_CODES[data.daily.weather_code[0]] || { description: 'Unknown weather', icon: '❓' };
        setWeatherData({
          maxTemp: Math.round(data.daily.temperature_2m_max[0]),
          minTemp: Math.round(data.daily.temperature_2m_min[0]),
          weatherCode: data.daily.weather_code[0],
          description: weatherInfo.description,
          icon: weatherInfo.icon,
          city: cityForWeather
        });
      } else {
        throw new Error('Weather data not available.');
      }
    } catch (error) {
      console.error("Weather fetch error:", error);
      setWeatherError((error as Error).message || 'Failed to fetch weather data.');
      setWeatherData(null);
    } finally {
      setIsWeatherLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userCity) {
      fetchCoordinates(userCity).then(coords => {
        if (coords) {
          fetchWeather(coords, userCity);
        }
      });
    }
  }, [userCity, fetchCoordinates, fetchWeather]);
  
  const addNotification = useCallback((message: string, type: AppNotification['type'] = 'event_reminder', eventId?: string) => {
    setNotifications(prev => {
      // Prevent duplicate event reminders if already notified
      if (type === 'event_reminder' && eventId && prev.some(n => n.eventId === eventId && n.type === 'event_reminder')) {
        return prev;
      }
      const newNotification: AppNotification = {
        id: crypto.randomUUID(),
        eventId,
        message,
        timestamp: new Date(),
        type,
      };
      return [newNotification, ...prev].slice(0, 20); // Keep last 20 notifications
    });
  }, []);

  const markEventAsNotified = useCallback((eventId: string) => {
    setEvents(prevEvents => prevEvents.map(e => e.id === eventId ? { ...e, notified: true } : e));
  }, []);

  const checkReminders = useCallback(() => {
    const currentTime = new Date();
    events.forEach(event => {
      if (!event.notified) {
        if (event.date && event.time) {
          const eventDateTime = new Date(`${event.date}T${event.time}`);
          if (eventDateTime <= currentTime) {
            let reminderMessage = `Reminder for "${event.title}"`;
            if (event.phoneNumber) reminderMessage += ` to ${event.phoneNumber}`;
            reminderMessage += `: ${event.whatsAppMessage}`;
            addNotification(reminderMessage, 'event_reminder', event.id);
            markEventAsNotified(event.id);
          }
        }
      }
    });
  }, [events, addNotification, markEventAsNotified]);

  // Simulated Daily 9 AM Update
  const checkAndSendDailyUpdate = useCallback(() => {
    if (!userCity || !weatherData) return; // Need city and weather to send update

    const now = new Date();
    const lastUpdateStr = localStorage.getItem('lastDailyUpdateSentTimestamp');
    const lastUpdateDate = lastUpdateStr ? new Date(parseInt(lastUpdateStr, 10)) : null;

    const todayAt9AM = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0);

    if (now >= todayAt9AM) {
      if (!lastUpdateDate || lastUpdateDate < todayAt9AM) {
        let summaryMessage = `Good morning! Daily update for ${userCity} (${now.toLocaleDateString()}):\n`;
        summaryMessage += `Weather: ${weatherData.description}, ${weatherData.minTemp}°C / ${weatherData.maxTemp}°C ${weatherData.icon}\n`;
        
        const todayDateString = now.toISOString().split('T')[0];
        const todaysEvents = events.filter(event => event.date === todayDateString);

        if (todaysEvents.length > 0) {
          summaryMessage += "Today's events:\n";
          todaysEvents.forEach(event => {
            summaryMessage += `- ${event.title} at ${event.time}\n`;
          });
        } else {
          summaryMessage += "No events scheduled for today.";
        }
        
        addNotification(summaryMessage, 'daily_summary');
        localStorage.setItem('lastDailyUpdateSentTimestamp', now.getTime().toString());
      }
    }
  }, [userCity, weatherData, events, addNotification]);

  useEffect(() => {
    if (!isLoadingInitialSetup && userPhoneNumber && userCity) {
       checkReminders(); // Initial check
       const reminderIntervalId = setInterval(checkReminders, 60000);
       checkAndSendDailyUpdate(); // Check for daily update
       return () => clearInterval(reminderIntervalId);
    }
  }, [isLoadingInitialSetup, userPhoneNumber, userCity, checkReminders, checkAndSendDailyUpdate]);


  const handleAddEvent = (eventData: Omit<CalendarEvent, 'id' | 'notified' | 'color'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: crypto.randomUUID(),
      notified: false,
      color: eventColors[events.length % eventColors.length],
    };
    setEvents(prevEvents => [...prevEvents, newEvent]);
  };

  const handlePrevMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  const handleToday = () => setCurrentDate(new Date());
  const openModalWithDate = (date: Date) => {
    setSelectedDateForModal(date);
    setIsEventModalOpen(true);
  };
  const openEventModal = () => {
    setSelectedDateForModal(null); 
    setIsEventModalOpen(true);
  };

  if (isLoadingInitialSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-900 via-purple-900 to-rose-950 flex justify-center items-center">
        <p className="text-xl text-pink-300 animate-pulse">Loading App...</p>
      </div>
    );
  }

  if (isPhoneNumberSetupModalOpen) {
    return <PhoneNumberSetupModal isOpen={isPhoneNumberSetupModalOpen} onSubmit={handleSetUserPhoneNumber} />;
  }

  if (isCitySetupModalOpen) {
    return <CitySetupModal isOpen={isCitySetupModalOpen} onSubmit={handleSetUserCity} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-900 via-purple-900 to-rose-950 text-rose-100 flex flex-col items-center p-4 sm:p-8 selection:bg-pink-500 selection:text-white">
      <div className="w-full max-w-5xl bg-rose-800 shadow-2xl rounded-lg p-6">
        <h1 className="text-4xl font-bold text-center mb-2 text-pink-400">Daily Planner & Weather</h1>
        
        {userCity && (
          <WeatherDisplay 
            weatherData={weatherData} 
            isLoading={isWeatherLoading} 
            error={weatherError}
            onUpdateCity={() => setIsCitySetupModalOpen(true)}
          />
        )}
        
        <ReminderList notifications={notifications} setNotifications={setNotifications} />

        <CalendarHeader
          currentDate={currentDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onToday={handleToday}
          onAddEventClick={openEventModal}
        />
        <CalendarGrid
          currentDate={currentDate}
          events={events}
          onDayClick={openModalWithDate}
        />
      </div>
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSubmit={handleAddEvent}
        initialDate={selectedDateForModal}
        defaultPhoneNumber={userPhoneNumber} 
      />
       <footer className="text-center mt-8 text-rose-300 text-sm space-y-1">
        <p>&copy; {new Date().getFullYear()} Daily Planner. For demonstration purposes only.</p>
        <p>Events & settings are stored locally. No actual WhatsApp messages are sent.</p>
        {userPhoneNumber && <p>Default Reminder Number: {userPhoneNumber}</p>}
        {userCity && <p>Weather for: {userCity}</p>}
      </footer>
    </div>
  );
};

export default App;
