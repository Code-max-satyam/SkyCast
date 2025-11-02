import React from "react";

// 💡 getIconUrl prop receive karen
const Fivedaycast = ({ forecastData, getIconUrl }) => { 
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "short",
        }).format(date);
    };

    // ✅ New Logic: Data ko din ke hisaab se group karein
    const dailyForecasts = {};

    forecastData.list.forEach((item) => {
        const date = item.dt_txt.split(" ")[0];

        if (!dailyForecasts[date]) {
            dailyForecasts[date] = {
                temps: [],
                icon: item.weather[0].icon, // Default icon, can be improved
                dt_txt: item.dt_txt,
            };
        }
        
        // Max temp nikalne ke liye saare temps store karein
        dailyForecasts[date].temps.push(item.main.temp_max); 
    });

    // ✅ Final daily data ko array mein convert karein, skipping today's partial day
    const processedDailyData = Object.keys(dailyForecasts)
        .slice(1, 6) // Aaj ke din ko chhodkar aage ke 5 din
        .map(date => {
            const temps = dailyForecasts[date].temps;
            const maxTemp = Math.max(...temps);
            
            // Icon ko behtar banane ke liye, hum sirf 12:00:00 ya 15:00:00 wala icon use kar sakte hain
            // For simplicity here, we'll keep the first icon, but ideally you'd find the most common icon for the day.
            const representativeItem = forecastData.list.find(item => item.dt_txt.startsWith(date));

            return {
                date: dailyForecasts[date].dt_txt,
                temp: Math.round(maxTemp),
                icon: representativeItem ? representativeItem.weather[0].icon : '01d' // Fallback icon
            };
        });

    return (
        <div
            style={{
                backgroundColor: "#4B5563",
                color: "white",
                borderRadius: "0.5rem",
                width: "250px", // Width same as Mainweather for alignment
                padding: "15px",
                paddingLeft: "25px", // Adjust padding for better look
                paddingRight: "25px"
            }}
        >
            {/* Display only the next 5 full days */}
            {processedDailyData.map((item, index) => (
                <div
                    key={index}
                    style={{
                        marginBottom: "15px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: index < processedDailyData.length - 1 ? "1px solid rgba(255,255,255,0.2)" : 'none',
                        paddingBottom: "10px",
                        paddingTop: index > 0 ? "10px" : "0",
                    }}
                >
                    {/* Date */}
                    <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                        {formatDate(item.date)}
                    </div>

                    {/* Icon - 💡 Now using the utility prop */}
                    {item.icon && (
                        <img
                            src={getIconUrl(item.icon)}
                            alt="weather icon"
                            style={{ width: "40px", height: "40px" }}
                        />
                    )}

                    {/* Temp (Max Temp) */}
                    <div style={{ fontSize: "15px", fontWeight: "bold" }}>
                        {item.temp}°c
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Fivedaycast;