import React, { useEffect, useState } from 'react';

function WeatherApp() {
    const [location, setLocation] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);

    const API_KEY = 'a480596a6da1445f97a201702250906';

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!location.trim()) {
            setErrorMessage("Please enter a city name.");
            return;
        }

        setIsLoading(true);
        setErrorMessage('');
        setWeatherData(null);

        try {
            const response = await fetch(
                `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location}`
            );
            if (!response.ok) throw new Error('Failed to fetch weather data');
            const data = await response.json();
            setWeatherData(data);
        } catch (error) {
            setErrorMessage(error.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUseMyLocation = () => {
        if (!navigator.geolocation) {
            setErrorMessage("Geolocation is not supported by your browser.");
            return;
        }

        setIsLoading(true);
        setErrorMessage('');
        setWeatherData(null);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await fetch(
                        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${latitude},${longitude}`
                    );
                    if (!response.ok) throw new Error('Failed to fetch weather data');
                    const data = await response.json();
                    setWeatherData(data);
                    setLocation(`${data.location.name}, ${data.location.country}`);
                } catch (error) {
                    setErrorMessage(error.message || 'Something went wrong');
                } finally {
                    setIsLoading(false);
                }
            },
            (error) => {
                setErrorMessage("Permission denied or unavailable.");
                setIsLoading(false);
            }
        );
    };

    const toggleTheme = () => {
        setIsDarkMode((prev) => !prev);
    };

    useEffect(() => {
        document.body.style.backgroundColor = isDarkMode ? '#1e1e1e' : '#f9f9f9';
        document.body.style.color = isDarkMode ? '#ffffff' : '#000000';
    }, [isDarkMode]);

    return (
        <div className="weather-container">
            <div>
                <h1>Weather App</h1>
                <button onClick={toggleTheme} style={{ marginBottom: '1rem' }}>
                    {isDarkMode ? '🌞Light Mode' : '🌙Dark Mode'}
                </button>
            </div>

            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter City"
                />
                <button type="submit">Search</button>
            </form>

            <button type="button" onClick={handleUseMyLocation} style={{ marginTop: '1rem' }}>
                Use My Location
            </button>

            {isLoading && <p>Loading...</p>}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

            {weatherData && (
                <div className='weather-details'>
                    <h2>{weatherData.location.name}, {weatherData.location.country}</h2>
                    <p>{weatherData.current.condition.text}</p>
                    <img src={weatherData.current.condition.icon} alt="Weather icon" />
                    <p><strong>Temperature:</strong> {weatherData.current.temp_c}°C / {weatherData.current.temp_f}°F</p>
                    <p><strong>Humidity:</strong> {weatherData.current.humidity}%</p>
                    <p><strong>Wind Speed:</strong> {weatherData.current.wind_kph} km/h</p>
                    <p><strong>Feels Like:</strong> {weatherData.current.feelslike_c}°C</p>
                    <p><strong>Local Time:</strong> {weatherData.location.localtime}</p>
                </div>
            )}
        </div>
    );
}

export default WeatherApp;
