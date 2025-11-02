import React, { useEffect, useState } from "react";
import Navbar from "./Components/Navbar";
import Mainweather from "./Components/Mainweather";
import Fivedaycast from "./Components/Fivedaycast";
import Todayhighlights from "./Components/Todayhighlights";
import axios from "axios";

// 💡 Utility function for weather icons
const getIconUrl = (iconCode) => {
    if (!iconCode) return null;
    return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
};

// 💡 Utility function for time formatting
const formatUnixTimestamp = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};

// 💡 Custom hook to check screen size
const useScreenSize = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return isMobile;
};


const App = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [city, setCity] = useState("Delhi");
    const [airQualityData, setAirQualityData] = useState(null);
    const [fiveDayForecast, setFiveDayForecast] = useState(null);
    const [error, setError] = useState(null);
    const [darkMode, setDarkMode] = useState(true);

    const API_KEY = "1566b82bc8be54acf1ceebedaf59cec1"; // आपकी API Key

    // -----------------------------------------------------------
    // ✅ RESTORED FUNCTIONS START HERE
    // -----------------------------------------------------------

    const fetchAirQualityData = (lat, lon) => {
        axios
            .get(
                `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
            )
            .then((response) => {
                if (response.data && response.data.list.length > 0) {
                    setAirQualityData(response.data.list[0]);
                }
            })
            .catch((error) =>
                console.error("Error fetching the air quality data:", error)
            );
    };

    const fetchWeatherData = (cityName) => {
        setError(null);
        fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`
        )
            .then((response) => response.json())
            .then((data) => {
                if (data.cod !== 200) {
                    setError("City not found!");
                    setWeatherData(null);
                    setAirQualityData(null);
                    setFiveDayForecast(null);
                    return;
                }

                setWeatherData(data);
                if (data.coord) {
                    fetchAirQualityData(data.coord.lat, data.coord.lon);
                }

                // Fetch 5-Day Forecast
                axios
                    .get(
                        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${API_KEY}`
                    )
                    .then((response) => {
                        setFiveDayForecast(response.data);
                    })
                    .catch((error) =>
                        console.error("Error fetching the 5-day forecast data:", error)
                    );
            })
            .catch((error) => {
                console.error("Error fetching the weather data:", error);
                setError("Something went wrong while fetching weather data!");
            });
    };

    const fetchWeatherByCoords = (lat, lon) => {
        setError(null);
        fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        )
            .then((response) => response.json())
            .then((data) => {
                if (data.cod !== 200) {
                    setError("Could not get weather for your location!");
                    return;
                }
                
                setCity(data.name); 
                setWeatherData(data);
                fetchAirQualityData(lat, lon);
                
                axios
                    .get(
                        `https://api.openweathermap.org/data/2.5/forecast?q=${data.name}&units=metric&appid=${API_KEY}`
                    )
                    .then((response) => {
                        setFiveDayForecast(response.data);
                    })
                    .catch((error) =>
                        console.error("Error fetching the 5-day forecast data:", error)
                    );
            })
            .catch((error) => {
                console.error("Error fetching the weather data by coords:", error);
                setError("Something went wrong while fetching location weather!");
            });
    };

    const handleCurrentLocationClick = () => {
        setError("Fetching current location...");
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchWeatherByCoords(latitude, longitude);
                    setError(null);
                },
                (err) => {
                    console.error("Geolocation Error:", err);
                    setError("Cannot access your location. Please check browser settings.");
                }
            );
        } else {
            setError("Geolocation is not supported by this browser.");
        }
    };


    const handleSearch = (searchedCity) => {
        setCity(searchedCity);
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    // -----------------------------------------------------------
    // ✅ RESTORED FUNCTIONS END HERE
    // -----------------------------------------------------------

    // 💡 Hook to determine screen size
    const isMobile = useScreenSize();

    useEffect(() => {
        if (city) {
            fetchWeatherData(city);
        }
    }, [city]);


    return (
        <div
            style={{
                backgroundColor: darkMode ? "#1F2937" : "#F3F4F6",
                color: darkMode ? "white" : "black",
                minHeight: "100vh",
                transition: "all 0.3s ease-in-out",
            }}
        >
            <Navbar 
                onSearch={handleSearch} 
                onToggleTheme={toggleDarkMode} 
                darkMode={darkMode} 
                onCurrentLocationClick={handleCurrentLocationClick}
                isMobile={isMobile} // 💡 Passing isMobile prop
            />

            {/* ... (Error display remains the same) ... */}
            {error && (
                <p style={{ color: "red", fontWeight: "600", textAlign: "center", paddingTop: '10px' }}>
                    {error}
                </p>
            )}

            {/* ... (Main content layout remains the same) ... */}
            {weatherData && airQualityData && (
                <div 
                    style={{ 
                        display: "flex", 
                        padding: isMobile ? "15px" : "30px", 
                        gap: isMobile ? "15px" : "20px", 
                        flexDirection: isMobile ? "column" : "row", 
                    }}
                >
                    {/* Left Section */}
                    <div 
                        style={{ 
                            flex: isMobile ? "none" : "1", 
                            marginRight: isMobile ? "0" : "10px", 
                            width: isMobile ? '100%' : 'auto', 
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '15px'
                        }}
                    >
                        <div style={{display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '20px', width: '100%'}}>
                            <Mainweather 
                                weatherData={weatherData} 
                                getIconUrl={getIconUrl} 
                                isMobile={isMobile} 
                            />

                            <div style={{flex: 1, width: isMobile ? '100%' : 'auto'}}>
                                <p
                                    style={{
                                        fontWeight: "700",
                                        fontSize: "20px",
                                        marginTop: isMobile ? "15px" : "0", 
                                        marginBottom: '10px'
                                    }}
                                >
                                    5 Days Forecast
                                </p>
                                {fiveDayForecast && (
                                    <Fivedaycast forecastData={fiveDayForecast} getIconUrl={getIconUrl} isMobile={isMobile} />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            flex: isMobile ? "none" : "0.5", 
                            gap: isMobile ? "15px" : "20px",
                            width: isMobile ? '100%' : 'auto', 
                        }}
                    >
                        <Todayhighlights
                            weatherData={weatherData}
                            airQualityData={airQualityData}
                            formatUnixTimestamp={formatUnixTimestamp} 
                            isMobile={isMobile}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;