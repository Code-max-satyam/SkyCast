import React from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const Mainweather = ({ weatherData, getIconUrl, isMobile }) => {
    
    // --- FIX: currentDate calculation added ---
    const timestamp = weatherData?.dt || null;
    let currentDate = "Date not available";
    if (timestamp) {
        currentDate = new Date(timestamp * 1000).toLocaleDateString('en-IN', {
            weekday: 'long', 
            day: '2-digit', 
            month: 'short' 
        });
    }
    // ------------------------------------------

    const temperatureCelsius = Math.round(weatherData?.main?.temp) || "N/A"; 
    const weatherDescription = weatherData?.weather?.[0]?.description || "N/A";
    const cityName = weatherData?.name || "City not available";
    const countryName = weatherData?.sys?.country || "Country not available";
    const iconCode = weatherData?.weather?.[0]?.icon;
    const iconSrc = getIconUrl(iconCode); 
    

    return (
        <div 
            style={{ 
                backgroundColor: '#4B5563', 
                color: 'white', 
                borderRadius: '0.5rem', 
                width: isMobile ? '100%' : '250px', 
                padding: isMobile ? '20px' : '30px', 
                minHeight: '180px'
            }}
        >
            <div style={{fontSize:'20px'}}>Now</div>
            <div style={{
                display: 'flex', 
                alignItems: 'center', 
                fontSize: isMobile ? '30px' : '35px',
                fontWeight: 'bold' 
            }}>
                {temperatureCelsius}°c
                
                {iconSrc && (
                    <img 
                        src={iconSrc} 
                        alt={weatherDescription} 
                        style={{ 
                            width: isMobile ? '70px' : '80px', 
                            height: isMobile ? '70px' : '80px', 
                            marginLeft: '10px' 
                        }} 
                    />
                )}
            </div>
            
            <div 
                style={{ 
                    fontSize: '15px', 
                    marginTop: '8px', 
                    fontWeight:'50',
                    textTransform: 'capitalize' 
                }}
            > 
                {weatherDescription}
            </div>

            <div style={{ marginTop: '1rem' }}>
                <div style={{display:'flex',alignItems:'center', gap: '5px'}}>
                    {/* ✅ currentDate is now defined */}
                    <CalendarMonthIcon style={{ fontSize: '18px' }}/> 
                    <span style={{fontSize: '14px'}}>{currentDate}</span> 
                </div>
                <div style={{marginTop:'4px',display:'flex',alignItems:'center', gap: '5px'}}>
                    <LocationOnIcon style={{ fontSize: '18px' }}/>
                    <span style={{fontSize: '14px'}}>{cityName}, {countryName}</span>
                </div>
            </div>
        </div>
    );
};

export default Mainweather;