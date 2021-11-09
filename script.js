const APIKey = `Yg5Pb3GrHb1awx4HUiPxk38hOagvNs3Y`;
const body = document.querySelector("body");
const inputLocation = document.querySelector(".inputLocation");
const submitLocation = document.querySelector(".submitLocation");
const availableCities = document.querySelector(".availableCities");
const listOfCities = document.querySelector(".listOfCities");


// whenever you press submit, this gets the location, hours of availability and raining/not raining, sun up/down
submitLocation.addEventListener("submit", (e) => {
  e.preventDefault();
  // using the function getLocation that get location you typed and gets an api of cities
  getLocation(inputLocation.value);
});

// // get location from an api and its location key
const getLocation = async (location) => {
  const baseUrl = `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${APIKey}&q=${location}`;
  const response = await fetch(baseUrl);
  const data = await response.json();
  // filter for appropriate city

  renderCities(data);
};

// render available cities matching the input
const renderCities = (cities) => {
  // makes a list of cities
  cities.forEach((city) => {
    const cityItem = document.createElement("li");
    cityItem.innerHTML = `<p class='clickable'>${city.LocalizedName}, ${city.AdministrativeArea.LocalizedName}, <span>${city.Country.LocalizedName}</span</p>`;
    cityItem.id = city.Key;
    cityItem.className = '.clickable';

    cityItem.addEventListener("click", () => {
      // whenever you click on a city it will trigger getWeather() that gets that weather for the city you clicked
      getWeather(cityItem.id);
      // removes list of cities from the screen once you choose one
      body.removeChild(availableCities);
    });

    listOfCities.appendChild(cityItem);
  });
};



// // use location key to find weather for the location
const getWeather = async (locationKey) => {
  const baseUrl = `https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=${APIKey}`;
  const response = await fetch(baseUrl);
  const data = await response.json();

  gatherHourlyData(data);
}


let twelveHourObj = []
function gatherHourlyData(data) {

  let hourlyWeatherData = [];
  data.forEach((hourlyObject) => {

    hourlyWeatherData.push([getHourFromISOTime(hourlyObject.DateTime), hourlyObject.HasPrecipitation, hourlyObject.IsDaylight]);

    // push to global variable for debugging; REMOVE LATER
    twelveHourObj.push([getHourFromISOTime(hourlyObject.DateTime), hourlyObject.HasPrecipitation, hourlyObject.IsDaylight]);
  })


  // data is in form of time (hour), will rain, is daylight
  // console.log(hourlyWeatherData);
  displayHourlyDaya(hourlyWeatherData);
}

function displayHourlyDaya(hourlyArray) {

  hourlyArray.forEach((subArray) => {
    const hourItem = document.createElement("li");

    hourItem.innerText = subArray[0];

    if (subArray[1] === true) {
      hourItem.classList.add("rain")
      hourItem.innerText = hourItem.innerText + ' ☔';
    } else {
      hourItem.innerText = hourItem.innerText + ' 🍂';
    }

    if (subArray[2] === false) {
      hourItem.classList.add("night")
      hourItem.innerText = hourItem.innerText + ' 🌚';
    } else {
      hourItem.innerText = hourItem.innerText + ' 🌞';
    }

    body.appendChild(hourItem);
  })
}





function getHourFromISOTime(isoTime) {
  return isoTime.substring(11, 16)
}