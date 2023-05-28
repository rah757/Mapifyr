const placeForm = document.querySelector("#placeForm")

const dataSpan = document.querySelector("#dataSpan")

const locationSpan = document.querySelector("#locationSpan")

const baseUrl = "https://geocode.maps.co/search?q="
const apiKey = "" // Add your API Key here

const altitudeApi = "https://api.open-meteo.com/v1/elevation?"

const sunApi = "https://api.sunrisesunset.io/json?"

const timeApi = "https://timeapi.io/api/TimeZone/coordinate?"


let data;
let latitude;
let longitude;
let elevation;
let sunrise;
let sunset;


async function getData(place){

    const response = await fetch(`${baseUrl}${place}`)

    const responseData = await response.json()

    data = responseData

    // console.log(data)
    
    console.log(response.status)

     //retrieve only the first element of the data
    console.log(data[0].lat, data[0].lon) //log latitude and longtitude of the place

    latitude = data[0].lat;
    longitude = data[0].lon;

    if(data.length === 0){
        dataSpan.innerHTML  = `Could not retrieve data, try another location`
        locationSpan.innerHTML = ''
        dataSpan.innerHTML = htmlCoords
        locationSpan.innerHTML = location
        return;
    }


    const htmlCoords = `<p> Latitude = ${data[0].lat}  Longitude = ${data[0].lon} </p>`
    let location = `<p> The area that had been identified is ${data[0].display_name} </p>`

    dataSpan.innerHTML = htmlCoords
    locationSpan.innerHTML = location
    console.log("printed coordinates")


    // TO RETRIEVE COUNTRY NAME
    let str = data[0].display_name
    console.log(str)
    let strArr = str.split(", ");
    let country = strArr.pop();
    console.log(country)

    getAltitude(longitude,latitude)

}


//ELEVATION API
async function getAltitude(longitude,latitude){

    const response = await fetch(`${altitudeApi}latitude=${latitude}&longitude=${longitude}`)

    const responseData = await response.json()

    data = responseData

    console.log(response.status)

    elevation = data.elevation

    console.log(elevation)

    let elevationHtml = `<p> The altitude in the area is ${elevation}m </p>`
    elevationSpan.innerHTML = elevationHtml

    getSun(longitude,latitude)

}

//SUNRISE SUNSET API
async function getSun(longitude,latitude){

    const response = await fetch(`${sunApi}lat=${latitude}&lng=${longitude}&timezone=IST&date=today`)

    const responseData = await response.json()

    data = responseData

    console.log(response.status)
    
    console.log(data.results)
    
    sunrise = data.results.sunrise

    sunset = data.results.sunset

    let sunriseHTML = `<p> Sunrise: ${sunrise} </p>`
    sunriseSpan.innerHTML = sunriseHTML
    
    let sunsetHTML = `<p> Sunset: ${sunset} </p>`
    sunsetSpan.innerHTML = sunsetHTML

    getTime(latitude,longitude)
    
}



placeForm.addEventListener("submit", handleSubmit)

function handleSubmit(event){
    event.preventDefault()
    let place = placeForm.elements["place"].value
    console.log("Hello world")
    getData(place)

}