import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import FilterDramaTwoToneIcon from '@mui/icons-material/FilterDramaTwoTone';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NightsStayIcon from '@mui/icons-material/NightsStay';

// 💡 FIX: Added all required props: onCurrentLocationClick and isMobile
const Navbar = ({ onSearch, onToggleTheme, darkMode, onCurrentLocationClick, isMobile }) => { 
    const [searchCity, setSearchCity] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    
    // IMPORTANT: Use your actual OpenWeatherMap API Key
    const API_KEY = "1566b82bc8be54acf1ceebedaf59cec1"; 

    // ✅ Suggestions fetch करने के लिए function
    const fetchSuggestions = async (query) => {
        if (query.length < 2) { 
            setSuggestions([]);
            return;
        }

        try {
            const response = await fetch(
                `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
            );
            const data = await response.json();
            
            const citySuggestions = data.map(item => ({
                name: item.state 
                    ? `${item.name}, ${item.state}, ${item.country}`
                    : `${item.name}, ${item.country}`
            }));
            setSuggestions(citySuggestions);

        } catch (error) {
            console.error("Error fetching city suggestions:", error);
            setSuggestions([]);
        }
    };

    // ✅ FIX: handleInputChange function को define किया गया है
    const handleInputChange = (e) => {
        const query = e.target.value;
        setSearchCity(query);
        fetchSuggestions(query); // Type करते ही suggestions fetch करें
    };

    // ✅ Search button click या suggestion select होने पर
    const handleSearchClick = () => {
        if (searchCity.trim()) {
            onSearch(searchCity);
            setSuggestions([]); // Search के बाद suggestions hide कर दें
        }
    };

    // ✅ जब user किसी suggestion पर click करता है
    const handleSuggestionClick = (suggestionName) => {
        setSearchCity(suggestionName);
        onSearch(suggestionName); // Weather data fetch करें
        setSuggestions([]); // Suggestions list hide करें
    };


    return (
        <nav
            style={{
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
                padding: isMobile ? "10px 15px" : "10px 30px", // 💡 Responsive Padding
                flexDirection: isMobile ? 'column' : 'row', // 💡 Stacked on mobile
                gap: isMobile ? '15px' : '0',
                justifyContent: "space-between",
            }}
        >
            {/* Left Section: Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: "2px", color: darkMode ? 'white' : 'black', alignSelf: isMobile ? 'flex-start' : 'center' }}>
                <FilterDramaTwoToneIcon />
                <p style={{ fontWeight: "bold", fontSize: "20px", cursor: "pointer" }}>SkyCast</p>
            </div>

            {/* Middle Section: Search Bar & Suggestions */}
            <div style={{ position: 'relative', display: "flex", alignItems: "center", gap: "4px", width: isMobile ? '100%' : 'auto' }}> 
                <TextField
                    variant="outlined"
                    placeholder="Search city name"
                    size="small"
                    value={searchCity}
                    onChange={handleInputChange} // ✅ FIX: handleInputChange अब defined है
                    style={{
                        backgroundColor: "white",
                        borderRadius: "2rem",
                        width: isMobile ? "100%" : "22rem", // 💡 Responsive Width
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <Button
                    variant="contained"
                    onClick={handleSearchClick}
                    style={{ borderRadius: "6px" ,backgroundColor: '#1cb7aaff', flexShrink: 0}}
                >
                    Search
                </Button>
                
                {/* Suggestions Dropdown List */}
                {suggestions.length > 0 && (
                    <div 
                        style={{
                            position: 'absolute',
                            top: '45px', 
                            left: 0,
                            zIndex: 10,
                            backgroundColor: 'white',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            width: isMobile ? 'calc(100% - 4px)' : 'calc(22rem + 4px)',
                            boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
                            maxHeight: '200px', 
                            overflowY: 'auto'
                        }}
                    >
                        {suggestions.map((suggestion, index) => (
                            <div
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion.name)}
                                style={{
                                    padding: '10px',
                                    cursor: 'pointer',
                                    color: 'black',
                                    borderBottom: index < suggestions.length - 1 ? '1px solid #eee' : 'none',
                                    backgroundColor: '#ffffff',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                            >
                                {suggestion.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Right Section: Theme Toggle + Current Location */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", alignSelf: isMobile ? 'flex-start' : 'center', marginTop: isMobile ? '5px' : '0' }}>
                
                {/* Theme Toggle Button */}
                <IconButton 
                    onClick={onToggleTheme} 
                    sx={{ 
                        color: darkMode ? 'white' : 'black',
                        backgroundColor: darkMode ? '#374151' : 'transparent',
                        '&:hover': {
                            backgroundColor: darkMode ? '#4B5563' : 'rgba(0, 0, 0, 0.04)',
                        },
                    }}
                    aria-label="Toggle Dark/Light Mode"
                >
                    {darkMode ? <WbSunnyIcon /> : <NightsStayIcon />}
                </IconButton>
                
                {/* Current Location Button - 💡 Added onClick handler */}
                <div 
                    onClick={onCurrentLocationClick} // ✅ FIX: onCurrentLocationClick prop use kiya gaya hai
                    style={{
                        fontSize: "16px",
                        fontWeight: "700",
                        backgroundColor: '#1cb7aaff',
                        height: "35px",
                        width: isMobile ? "130px" : "150px", 
                        color:'white',
                        gap:'2px',
                        borderRadius: "6px",
                        alignItems: "center",
                        display: "flex",
                        justifyContent: "center",
                        cursor: "pointer",}}
                >
                    <GpsFixedIcon style={{fontSize: isMobile ? '20px' : '24px'}} />
                    <p style={{ fontSize: isMobile ? '12px' : '14px' }}>Current Location</p>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;