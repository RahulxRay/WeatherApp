import { useEffect, useState } from 'react';
import axios from 'axios';

const Geocoding = (props) => {
    const [location, setLocation] = useState('');
    const [locationData, setLocationData] = useState(null);
    const [locationsArr, setLocationsArr] = useState(null);

    const [inputFocused, setInputFocused] = useState(false);
    const [placeholder, setPlaceholder] = useState("Enter Location");

    const [userLocation, setUserLocation] = useState(null);

    // Recent locations — persisted in localStorage, capped at 3 entries.
    // Each entry is the full location object returned by the geocoding API.
    const [recentLocations, setRecentLocations] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('recentLocations') || '[]');
        } catch {
            return [];
        }
    });

    // Adds a selected location to the front of the recent list, deduplicates by id,
    // trims to 3, then saves back to localStorage.
    const addToRecent = (loc) => {
        setRecentLocations(prev => {
            const filtered = prev.filter(r => r.id !== loc.id);
            const updated = [loc, ...filtered].slice(0, 3);
            localStorage.setItem('recentLocations', JSON.stringify(updated));
            return updated;
        });
    };

    // Removes a single location from the recent list by id.
    const removeFromRecent = (id) => {
        setRecentLocations(prev => {
            const updated = prev.filter(r => r.id !== id);
            localStorage.setItem('recentLocations', JSON.stringify(updated));
            return updated;
        });
    };

    const fetchData = async () => {
        if (!location){return;}
        try{
            const response = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=5`)

            if (!response || !response.data.results) {
                return;
            }

            setLocationData(response.data.results[0]);
            setLocationsArr(response.data.results);
            setPlaceholder(response.data.results[0].name + ", " + response.data.results.admin1 + ", " + response.data.results.country);
            props.sendData(locationData);
        }
        catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if(location === ''){
            return
        }
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        setLocation(e.target.value);
        e.preventDefault();
        fetchData();
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        fetchData();
    };

    const handleClick = (index) => {
        const selected = locationsArr[index];
        setPlaceholder(selected.name + ", " + selected.admin1 + ", " + selected.country)
        setLocation(selected.name + ", " + selected.admin1 + ", " + selected.country);
        setLocationData(selected);
        props.sendData(selected);
        addToRecent(selected); // save to recent list
        setLocationsArr(null);
        setInputFocused(false);
    };

    const handleInputFocus = () => {
        setInputFocused(true);
    }

    const handleInputBlur = () => {
        setInputFocused(false);
        setLocation("");
    }

    const getUserLocation = () => {
        setLocation("");
        setPlaceholder("Current Location");
        
        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition(
                (position)=>{
                    setUserLocation(position.coords);
                    {userLocation && (
                        props.sendData(userLocation)
                    )}
                },
                (error)=>{
                    console.log(error.message)
                },
                {
                    enableHighAccuracy: false,
                    timeout: 5000,
                    maximumAge: 0,    
                }
            )
        }
    }

    return (
        <div className="" id="geocoding">
            {
            <form onSubmit={handleSubmit} className="mb-2">
                <div className="row p-0 m-0 no-gutters justify-content-center">
                    <div className="col p-0" 
                        onMouseEnter={handleInputFocus}
                        onMouseLeave={handleInputBlur}
                        onTouchStart={handleInputFocus}
                        onTouchCancel={handleInputBlur}
                    >
                        <div className="input-group rounded-pill shadow">
                            {/* Get GPS location */}
                            <button 
                                type="button"
                                className={props.darkMode ? "btn btn-dark border border-dark-emphasis rounded-start-pill" : "btn btn-light border border-light-emphasis rounded-start-pill"}
                                onClick={getUserLocation}
                            >📍</button>
                            <input 
                                type='text' 
                                placeholder={placeholder}
                                value={location} 
                                onChange={handleInputChange}
                                className={props.darkMode ? "form-control bg-dark text-light input-dark" : "form-control bg-light"}
                                onFocus={handleInputFocus}>
                            </input>
                            <span className={props.darkMode ? "input-group-text bg-dark rounded-end-pill" : "input-group-text bg-light rounded-end-pill"}>🔍</span>
                        </div>
                    </div>
                    
                </div>
                <div className="row w-100 p-0 m-0 no-gutters">
                    {locationsArr && inputFocused &&(
                    <>
                    <div  className="col p-0 m-0">
                        <div className="btn-group-vertical w-100" role="group">
                            {locationsArr.map((locationItem, index) => (
                                <button 
                                    onClick={() => handleClick(index)} 
                                    onMouseEnter={handleInputFocus}
                                    onMouseLeave={handleInputBlur}
                                    className={props.darkMode ? "btn btn-dark w-100" : "btn btn-light w-100"}
                                    type="button"
                                    key={index}>
                                    {locationItem.name + ", " + locationItem.admin1 + ", " + locationItem.country}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    </>
                    )}
                </div>

                {/* Recent locations — shown when the recent list is populated and the dropdown isn't open */}
                {recentLocations.length > 0 && !locationsArr && (
                    <div className="mt-3 px-1">
                        {/* "Recent" label */}
                        <span style={{
                            fontSize: "0.85rem",
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            fontWeight: 800,
                            color: props.darkMode ? "white" : "#333",
                            background: props.darkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.07)",
                            padding: "3px 10px",
                            borderRadius: "999px",
                            display: "inline-block",
                        }}>⏱ Recent</span>
                        <div className="d-flex flex-wrap gap-2 mt-2">
                            {recentLocations.map((loc, i) => {
                                // Colours drawn from the app's blue-teal maritime palette
                                const colours = props.darkMode
                                    ? ["#2d6a9f", "#2d7a72", "#4a5494"]
                                    : ["#5b9fc8", "#5aaea5", "#7988c0"];
                                return (
                                    <div
                                        key={loc.id ?? i}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            borderRadius: "999px",
                                            backgroundColor: colours[i],
                                            boxShadow: "0 3px 10px rgba(0,0,0,0.22)",
                                        }}
                                    >
                                        {/* Main pill button — selects the location */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPlaceholder(loc.name + ", " + loc.admin1 + ", " + loc.country);
                                                setLocation(loc.name + ", " + loc.admin1 + ", " + loc.country);
                                                setLocationData(loc);
                                                props.sendData(loc);
                                                addToRecent(loc);
                                            }}
                                            style={{
                                                background: "none",
                                                border: "none",
                                                color: "white",
                                                fontWeight: 700,
                                                fontSize: "1rem",
                                                padding: "10px 8px 10px 16px",
                                                cursor: "pointer",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            📍 {loc.name}, {loc.country}
                                        </button>
                                        {/* Circular X button — removes just this entry */}
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); removeFromRecent(loc.id ?? loc.name); }}
                                            style={{
                                                width: 26,
                                                height: 26,
                                                borderRadius: "50%",
                                                background: "rgba(0,0,0,0.25)",
                                                border: "none",
                                                color: "white",
                                                fontWeight: 700,
                                                fontSize: "0.75rem",
                                                cursor: "pointer",
                                                lineHeight: 1,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                marginRight: 8,
                                                flexShrink: 0,
                                            }}
                                            aria-label="Remove from recent"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                
            </form>
            }
        </div>
    );
};

export default Geocoding;
