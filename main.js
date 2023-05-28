const placeForm = document.querySelector("#placeForm")

const dataSpan = document.querySelector("#dataSpan")

const locationSpan = document.querySelector("#locationSpan")

const baseUrl = "https://geocode.maps.co/search?q="

const altitudeApi = "https://api.open-meteo.com/v1/elevation?"

const sunApi = "https://api.sunrisesunset.io/json?"

const timeApi = "https://timeapi.io/api/TimeZone/coordinate?"

const apiKey = "" // Add your API Key here

let data;
let latitude;
let longitude;
let elevation;
let sunrise;
let sunset;
let address;

// making parameters for the ablility to make the map div removable and addable under mapParent
let divRemove = document.getElementById("map");
let divParent = document.getElementById("mapParent");


async function getData(place){

    const response = await fetch(`${baseUrl}${place}`)

    const responseData = await response.json()

    data = responseData

    // console.log(data)
    
    console.log(response.status)

     //retrieve only the first element of the data
    console.log(data[0].lat, data[0].lon) //log latitude and longitude of the place

    latitude = data[0].lat;
    longitude = data[0].lon;

    if(data.length === 0){
        dataSpan.innerHTML  = `Could not retrieve data, try another location`
        return;
    }

    address = data[0].display_name

    const htmlCoords = `<p> Latitude = ${data[0].lat} </p> <p>  Longitude = ${data[0].lon} </p>`
    let location = `<p> The area that had been identified is ${address} </p>`

    dataSpan.innerHTML = htmlCoords
    locationSpan.innerHTML = location
    console.log("printed coordinates")


    // TO RETRIEVE COUNTRY NAME  - cancelled functionality
    // let str = data[0].display_name
    // console.log(str)
    // let strArr = str.split(", ");
    // let country = strArr.pop();
    // console.log(country)

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

    let elevationHtml = `<p> The area is ${elevation}m above sea level </p>`
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

    // Adding map element 
    let childHTML = `<div id="map" style="border-radius: 25px;"></div>`;
    divParent.innerHTML = childHTML

    makeMap(latitude,longitude)
    
}

async function makeMap(longitude,latitude){

    var map = L.map('map').setView([longitude, latitude], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([longitude, latitude]).addTo(map)
    .bindPopup(`${address}`)
    .openPopup();

}

placeForm.addEventListener("submit", handleSubmit)

function handleSubmit(event){
    event.preventDefault()
    let place = placeForm.elements["place"].value


    // Removing the map div so it can be re-added in order for the map to be refreshable
    if(divRemove){                                                      
        if(divRemove && divRemove.parentNode){
            divRemove.parentNode.removeChild(divRemove);
            console.log("removed")
        }
    }


    console.log("Hello world")
    setTimeout(() => {getData(place)}, 300); 

}


