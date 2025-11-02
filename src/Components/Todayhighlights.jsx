import AirIcon from "@mui/icons-material/Air";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import InvertColorsIcon from "@mui/icons-material/InvertColors";
import VisibilityIcon from '@mui/icons-material/Visibility';
import CompressIcon from '@mui/icons-material/Compress';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import Highlightbox from "../Components/Highlightbox"

// 💡 formatUnixTimestamp prop added
const Todayhighlights = ({ weatherData, airQualityData, formatUnixTimestamp }) => {
    const { main, visibility, sys } = weatherData;
    const airQualityIndex = airQualityData?.main?.aqi; 
    const { co, no, no2, o3 } = airQualityData?.components || {};

    // ✅ Utility to get dynamic color based on AQI value
    const getAirQualityColor = (aqi) => {
        switch (aqi) {
            case 1:
                return "green"; 
            case 2:
                return "#76EE00"; 
            case 3:
                return "yellow"; 
            case 4:
                return "orange"; 
            case 5:
                return "red"; 
            default:
                return "gray"; 
        }
    };

    const renderAirQualityDescription = (aqi) => {
        switch (aqi) {
            case 1:
                return "Good";
            case 2:
                return "Fair";
            case 3:
                return "Moderate";
            case 4:
                return "Poor";
            case 5:
                return "Very Poor";
            default:
                return "Unknown";
        }
    };

    const highlights = [
        { title: "Humidity", value: `${main.humidity}%`, Icon: InvertColorsIcon },
        {
            title: "Pressure",
            value: `${main.pressure} hPa`,
            Icon: CompressIcon,
        },
        {
            title: "Visibility",
            value: `${(visibility / 1000).toFixed(1)} km`, 
            Icon:  VisibilityIcon,
        },
        {
            title: "Feels Like",
            value: `${Math.round(main.feels_like)}°C`, 
            Icon: DeviceThermostatIcon,
        },
    ];

    return (
        <div
            style={{
                backgroundColor: "#4B5563",
                color: "white",
                width: "840px",
                borderRadius: "0.5rem",
                padding: "30px",
            }}
        >
            <div style={{ fontSize: "20px" }}>Today's Highlights</div>
            <div
                style={{
                    display: "flex",
                    gap: "18px",
                }}
            >
                {/* Air Quality Index Box */}
                <div
                    style={{
                        backgroundColor: "#374151",
                        color: "white",
                        padding: "1rem",
                        borderRadius: "0.5rem",
                        marginTop: "11px",
                        width: "370px",
                    }}
                >
                    <div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: "22px",
                            }}
                        >
                            <p>Air Quality Index</p>
                            <div
                                style={{
                                    marginTop: "1rem",
                                    fontSize: "16px",
                                    fontWeight: "700",
                                    backgroundColor: getAirQualityColor(airQualityIndex), 
                                    height: "20px",
                                    width: "auto", 
                                    padding: '0 8px', 
                                    borderRadius: "6px",
                                    alignItems: "center",
                                    display: "flex",
                                    justifyContent: "center",
                                    textTransform: 'uppercase' 
                                }}
                            >
                                {renderAirQualityDescription(airQualityIndex)}
                            </div>
                        </div>
                        <div>
                            <AirIcon style={{ fontSize: "35px" }} />
                            <div
                                style={{
                                    marginTop: "1rem",
                                    display: "grid",
                                    gridTemplateColumns: "repeat(4, 1fr)",
                                    gap: "10px",
                                }}
                            >
                                <div>
                                    <p style={{ fontWeight: "bold" }}>CO</p>
                                    <p>{co ? co.toFixed(2) : '--'} µg/m³</p> 
                                </div>
                                <div>
                                    <p style={{ fontWeight: "bold" }}>NO</p>
                                    <p>{no ? no.toFixed(2) : '--'} µg/m³</p>
                                </div>
                                <div>
                                    <p style={{ fontWeight: "bold" }}>NO₂</p>
                                    <p>{no2 ? no2.toFixed(2) : '--'} µg/m³</p>
                                </div>
                                <div>
                                    <p style={{ fontWeight: "bold" }}>O₃</p>
                                    <p>{o3 ? o3.toFixed(2) : '--'} µg/m³</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sunrise And Sunset Box */}
                <div
                    style={{
                        backgroundColor: "#374151",
                        color: "white",
                        padding: "1rem",
                        borderRadius: "0.5rem",
                        marginTop: "11px",
                        width: "385px",
                    }}
                >
                    <div style={{ fontSize: "22px", }}>
                        <p>Sunrise And Sunset</p>
                        <div style={{ display: "flex", justifyContent: "space-between" ,padding:'10px'}}>
                            <div>
                                <WbSunnyIcon style={{ fontSize: "40px",marginLeft:'30px' }} />
                                {/* 💡 Used formatUnixTimestamp utility */}
                                <p style={{ fontSize: "25px",marginLeft:'20px' }} >
                                    {formatUnixTimestamp ? formatUnixTimestamp(sys.sunrise) : 'N/A'}
                                </p>
                            </div>
                            <div>
                                <NightsStayIcon style={{ fontSize: "40px",marginRight:'35px' }} />
                                {/* 💡 Used formatUnixTimestamp utility */}
                                <p style={{ fontSize: "25px",marginRight:'50px' }} >
                                    {formatUnixTimestamp ? formatUnixTimestamp(sys.sunset) : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Highlight Boxes */}
            <div
                style={{
                    display: "flex",
                    gap: "4px",
                    marginTop: "10px",
                }}
            >
                {highlights.map((highlight, index) => (
                    <Highlightbox
                        key={index}
                        title={highlight.title}
                        value={highlight.value}
                        Icon={highlight.Icon}
                    />
                ))}
            </div>
        </div>
    );
};

export default Todayhighlights;