import React from 'react';
import './index.css';
import reactDOM from 'react-dom/client'
import {useState, useEffect} from 'react';
import darkcloudy from './backgrounds/darkcloudy.mp4';
import currentLocaton from './backgrounds/currentLocation.png';
import tempC from './backgrounds/tempC.png';
import tempF from './backgrounds/tempF.png';

function CurrentLocationWeatherApp(props) {
    const [weather, setWeather] = useState({
        locationname: null,
        locationregion: null,
        temp_c: null,
        temp_f: null, 
        is_day: null,
        condition: null,
    });

    useEffect(() => {
        //larger aynchronous outer function that fetches the user's weather location asynchronously 
        async function fetchLocationWeather(){
            // internal async function to fetch the user's current location
            async function fetchLocation() {
                let location = await new Promise((resolve, reject) => {
                    if (navigator.geolocation) { //this if clause checks only if their browser SUPPORTS location tracking, NOT if it is on
                        window.navigator.geolocation.getCurrentPosition(
                        //resolving the internal promise of getCurrentPosition in both cases
                        (position) => {resolve(`${position.coords.latitude},${position.coords.longitude}`)}, (noLocation)=> {return reject('UserDeniedLocation')}
                        )
                    } else {
                    return reject('UserDeniedLocation')
                }}).then(fetchWasSuccessful => fetchWasSuccessful).catch(UserDeniedLocation => UserDeniedLocation)
                return location
            }
            //await the the fetching of the current location to be used in the weather api call
            let location = await fetchLocation()
            if (location == 'UserDeniedLocation'){
                return setWeather(false)
            }
            fetch(`http://api.weatherapi.com/v1/current.json?key=b9fe8d680f6c4beb92f183542220304&q=${location}&aqi=no`)
                .then(res => res.json())
                .then(data => setWeather({
                    ...weather,
                    locationname: data.location.name,
                    locationregion: data.location.region,
                    temp_c: data.current.temp_c,
                    temp_f: data.current.temp_f, 
                    is_day: data.current.is_day,
                    condition: data.current.condition.text,
                    })
                )
            }
        //call the function in the scope of useEffect's callback function
        fetchLocationWeather()}
    ,[])
    if (!weather) {
        return (
            <div className="text-white text-xl">
                Unable to pull location information, please turn your location on
            </div>
        )
    } else if (!weather.locationname){
        return(
        <div className="text-white text-3xl">
            Searching...
        </div>
        )
    } else {
        return(
            <div className="text-white text-5xl mx-5">
                <div className="text-3xl ml-4">It is currently &nbsp;</div><span className="text-9xl">{props.units ? weather.temp_f + '°F ' : weather.temp_c + '°C '} </span>
                <span className="text-3xl">in &nbsp;</span> <div><span className="text-6xl">{weather.locationname + ', '} </span> <span className="text-6xl">{weather.locationregion}</span></div>  
            </div>
        )
    }
}

function SearchWeatherApp(props) {
    const [weather, setWeather] = useState({
        locationname: null,
        locationregion: null,
        temp_c: null,
        temp_f: null, 
        is_day: null,
        condition: null,
    });

    useEffect(() => {
        fetch(`http://api.weatherapi.com/v1/current.json?key=b9fe8d680f6c4beb92f183542220304&q=${props.location}&aqi=no`)
            .then(res => res.json())
            .then(data => {
                    setWeather({
                        ...weather,
                        locationname: data.location.name,
                        locationregion: data.location.region ? data.location.region : data.location.country,
                        temp_c: data.current.temp_c,
                        temp_f: data.current.temp_f, 
                        is_day: data.current.is_day,
                        condition: data.current.condition.text,
                        })
                    })
            .catch(setWeather(false))

    },[props.location])

    if (!weather.locationname){
        return (
            <div>
            </div>
        )
    } else {

    return(
        <div className="text-white text-5xl mx-5">
            <div className="text-3xl ml-4">&nbsp; It is currently &nbsp;</div><span className="text-9xl">{props.units ? weather.temp_f + '°F ' : weather.temp_c + '°C '} </span>
            <span className="text-3xl">in &nbsp;</span> <div><span className="text-6xl">{weather.locationname + ', '} </span> <span className="text-6xl">{weather.locationregion}</span></div>  
        </div>
    )
}}

function WeatherApp() {
    const [units, setUnits] = useState(true)
    const [location, setLocation] = useState('NY');
    const [showCurrentLoc, setShowCurrentLoc] =useState(false)
    function handleLocationSwap() {
        setShowCurrentLoc(!showCurrentLoc)
    }
    function handleUnitChange(){
        setUnits(!units)
    }

    function handleSubmit(e){
        e.preventDefault()
        let searchData = e.target[0].value
        setShowCurrentLoc(false)
        setLocation(searchData)
        e.target.reset()
    }
    return(
        <> 
        <video className="absolute top-0 -z-50 object-cover" style={{height:"100%", width:"100%"}} src={darkcloudy} autoPlay muted loop></video>
        <div className="absolute w-full top-1/2">
            <div className='flex justify-center'>
                    <form className="widthset" onSubmit={handleSubmit}>
                        <input className='w-full rounded-full backdrop-blur-md text-white text-5xl text-center border-solid border-2 bg-transparent  active:border-slate-300' type='text'></input>
                    </form>
            </div>
        </div>

        <div className="absolute w-full top-1/2 mt-20">
            <div className='flex justify-center'>
                <div>
                    <button className="widthset-b bg-transparent backdrop-blur-md hover:bg-gray-600 py-1 px-24 text-white font-bold border rounded-full mx-3" onClick={handleLocationSwap}>
                            <img src={currentLocaton} alt=''></img>
                        </button>
                    <button className="widthset-b bg-transparent backdrop-blur-md hover:bg-gray-600 py-1 px-24 text-white font-bold border rounded-full mx-3" onClick={handleUnitChange}>
                            <img className="imagesize" src={units?tempF:tempC} alt=''></img>
                        </button>
                </div>
            </div>
        </div>

        <div className='flex justify-center mt-20'>
            {showCurrentLoc ? <CurrentLocationWeatherApp units={units}/>: <SearchWeatherApp location={location} units={units}/>}
        </div>
        </>
    )
}


const root = reactDOM.createRoot(document.getElementById('root'))
root.render(<WeatherApp />)