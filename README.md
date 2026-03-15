# React Weather App

A modern, responsive weather application built with React. This project was originally created as a Frontend Mentor challenge to practice React skills, and has since been refactored for improved code organization, readability, and scalability. The app has been converted to TypeScript to enhance type safety and developer experience.

## Features

- **Current Weather Display**: Shows real-time weather conditions for searched locations
- **Weather Metrics**: Detailed metrics including humidity, wind speed, pressure, and visibility
- **Hourly Forecast**: 24-hour weather forecast with temperature trends
- **Daily Forecast**: 7-day weather outlook
- **Location Search**: Search for weather by city name
- **Temperature Units**: Toggle between Celsius and Fahrenheit
- **Responsive Design**: Optimized for desktop and mobile devices
- **Loading States**: Smooth loading animations while fetching data

## Tech Stack

- **React 18** - UI library with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **ESLint** - Code linting
- **Custom Fonts** - Bricolage Grotesque and DM Sans for typography

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CurrentWeather.tsx
│   ├── CurrentWeatherMetrics.tsx
│   ├── DailyForecast.tsx
│   ├── Header.tsx
│   ├── HourlyForecast.tsx
│   ├── Loader.tsx
│   ├── Logo.tsx
│   ├── Search.tsx
│   ├── TempUnits.tsx
│   └── tempConversions.ts
├── hooks/               # Custom React hooks
│   └── useWeather.ts
├── types/               # TypeScript type definitions
│   └── types.ts
├── utils/               # Utility functions
│   └── weatherHelpers.ts
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
├── index.css            # Global styles
└── global.d.ts          # Global type declarations
```

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/react-weather-app.git
   cd react-weather-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Enter a city name in the search bar
2. View current weather conditions and metrics
3. Check hourly and daily forecasts
4. Toggle between Celsius and Fahrenheit using the temperature unit switcher

## API

This app uses a weather API (e.g., OpenWeatherMap) to fetch weather data. You'll need to obtain an API key and configure it in the application.

## Contributing

This is a personal practice project, but feel free to fork and experiment!

## Credits

- Original design challenge from [Frontend Mentor](https://www.frontendmentor.io)
- Weather data provided by weather API services
- Fonts: [Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque) and [DM Sans](https://fonts.google.com/specimen/DM+Sans)

## License

This project is for educational purposes only.
