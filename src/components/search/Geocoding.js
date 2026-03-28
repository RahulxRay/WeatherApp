import { useEffect, useState } from 'react';
import axios from 'axios';
import { MapPin as IconPin, Search as IconSearch } from 'lucide-react';

const Geocoding = (props) => {
    const [location, setLocation] = useState('');
    const [locationData, setLocationData] = useState(null);
    const [locationsArr, setLocationsArr] = useState(null);

    const [inputFocused, setInputFocused] = useState(false);
    const [placeholder, setPlaceholder] = useState(props.locationDisplay || "Enter Location");

    const [userLocation, setUserLocation] = useState(null);

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
        setPlaceholder(locationsArr[index].name + ", " + locationsArr[index].admin1 + ", " + locationsArr[index].country)
        setLocation(locationsArr[index].name + ", " + locationsArr[index].admin1 + ", " + locationsArr[index].country);
        setLocationData(locationsArr[index]);
        props.sendData(locationsArr[index]);
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
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0,    
                }
            )
        }
    }

    return (
        <div className="search-container" id="geocoding">
            <form onSubmit={handleSubmit}>
                <div className="row p-0 m-0 no-gutters justify-content-center">
                    <div className="col p-0"
                        onMouseEnter={handleInputFocus}
                        onMouseLeave={handleInputBlur}
                        onTouchStart={handleInputFocus}
                        onTouchCancel={handleInputBlur}
                    >
                        <div className="input-group shadow">
                            <button
                                type="button"
                                className="btn search-btn"
                                onClick={getUserLocation}
                            ><IconPin size={16} /></button>
                            <input
                                type="text"
                                placeholder={placeholder}
                                value={location}
                                onChange={handleInputChange}
                                className="form-control search-input"
                                onFocus={handleInputFocus}
                            />
                            <span className="input-group-text search-btn"><IconSearch size={16} /></span>
                        </div>
                    </div>
                </div>
                <div className="row w-100 p-0 m-0 no-gutters">
                    {locationsArr && inputFocused && (
                        <div className="col p-0 m-0">
                            <div className="location-dropdown btn-group-vertical w-100" role="group">
                                {locationsArr.map((locationItem, index) => (
                                    <button
                                        onClick={() => handleClick(index)}
                                        onMouseEnter={handleInputFocus}
                                        onMouseLeave={handleInputBlur}
                                        className="btn w-100"
                                        type="button"
                                        key={index}
                                    >
                                        {locationItem.name + ", " + locationItem.admin1 + ", " + locationItem.country}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default Geocoding;
