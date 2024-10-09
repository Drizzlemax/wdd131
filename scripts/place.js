import { fetchWeatherApi } from 'openmeteo';

// Set up parameters for the weather API request
const params = {
    "latitude": 52.52, // Example latitude (Berlin)
    "longitude": 13.41, // Example longitude (Berlin)
    "hourly": "temperature_2m" // Hourly weather data for temperature
};

const url = "https://api.open-meteo.com/v1/forecast";

// Helper function to create ranges for time
const range = (start, stop, step) => {
    return Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);
};

// Fetch weather data
(async () => {
    try {
        const responses = await fetchWeatherApi(url, params);

        // Process the response for the first location (can be extended for multiple locations)
        const response = responses[0];

        // Extract the timezone and location attributes
        const utcOffsetSeconds = response.utcOffsetSeconds();
        const timezone = response.timezone();
        const timezoneAbbreviation = response.timezoneAbbreviation();
        const latitude = response.latitude();
        const longitude = response.longitude();

        // Get hourly weather data
        const hourly = response.hourly();

        // Create a weather data object with time and temperature information
        const weatherData = {
            hourly: {
                time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
                    (t) => new Date((t + utcOffsetSeconds) * 1000)
                ),
                temperature2m: hourly.variables(0).valuesArray() // Temperature values
            }
        };

        // Log the weather data (date-time and temperature) to the console
        for (let i = 0; i < weatherData.hourly.time.length; i++) {
            console.log(
                weatherData.hourly.time[i].toISOString(), // ISO formatted time
                weatherData.hourly.temperature2m[i] // Temperature
            );
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
})();
