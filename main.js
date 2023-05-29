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

    const htmlCoordsHeader = `<h3> Coordinates: </h3>`
    const htmlCoords = `<p> Latitude = ${data[0].lat}&#xb0 </p> <p>  Longitude = ${data[0].lon}&#xb0 </p>`
    const locationHead = `<h3> Location: </h3>`
    const location = `<p>${address} </p>`

    dataHeader.innerHTML = htmlCoordsHeader
    dataSpan.innerHTML = htmlCoords
    locationHeader.innerHTML = locationHead
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

    let elevationHead = `<h3>Elevation: </h3>`
    let elevationHtml = `<p> This area is ${elevation}m above sea level </p>`
    elevationHeader.innerHTML = elevationHead
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

    let sunHead = `<h3>Sunrise and Sunset: </h3>`
    sunHeader.innerHTML = sunHead
    
    let sunHTML = `<p>&#x2600 Sunrise: ${sunrise} </p><p>&#x263C Sunset: ${sunset} </p>`
    sunSpan.innerHTML = sunHTML


    // Adding map element 
    let childHTML = `<span id="mapHeader" class="dataHeader"><h3>~Map~</h3></span>  <div id="map" class="dataSpan" style="border-radius: 25px;"></div>`;
    divParent.innerHTML = childHTML

    makeMap(latitude,longitude)

    returnHTML = `<a href="#header">Search another location?</a>`
    returnButton.innerHTML = returnHTML
    
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


