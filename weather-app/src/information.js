API_KEY = '3d705341b299b687f28daf213be81abd'

API_URL = 'https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}'


const lat = 43.157285
const lon = -77.615214
const api_key = '3d705341b299b687f28daf213be81abd'


async function fetchCurrentWeather(){
    await new Promise((resolve, reject) => {
        if(!window.navigator.geolocation) reject('User disabled location checking')
        else {
            window.navigator.geolocation.getCurrentPosition((position) => {
                resolve(`${position.coords.latitude},${position.coords.longitude}`)})}
        })
        .then(response => weather.func(response))
}