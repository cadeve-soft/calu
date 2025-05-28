
export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  whatsAppMessage: string;
  phoneNumber?: string; // Optional: User's WhatsApp phone number
  notified: boolean;
  color: string; // Event color for display
}

export interface AppNotification {
  id: string;
  message: string;
  timestamp: Date;
  eventId?: string; // Optional: link to a specific event
  type?: 'event_reminder' | 'daily_summary'; // Optional: to categorize notifications
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface WeatherData {
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
  description: string; // Human-readable weather description
  icon?: string; // Optional: text-based icon or class
  city?: string; // Store the city name with the weather data
}
