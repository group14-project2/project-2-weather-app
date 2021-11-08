const APIKey = `Yg5Pb3GrHb1awx4HUiPxk38hOagvNs3Y`;
const body = document.querySelector("body");
const inputLocation = document.querySelector(".inputLocation");
const submitLocation = document.querySelector(".submitLocation");
const availableCities = document.querySelector(".availableCities");
const listOfCities = document.querySelector(".listOfCities");
const labelSlots = document.querySelectorAll(".labelSlot");
const hourSlots = document.querySelectorAll(".hourSlot");
const isRaining = document.querySelector(".walkRain");
const isSunDown = document.querySelector(".walkSunDown");
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
const getWeather = async(locationKey) => {
  const baseUrl = `https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=${APIKey}`;
  const response = await fetch(baseUrl);
  const data = await response.json();
  console.log(data);

  gatherHourlyData(data);
}

// let hourlyWeatherData = [];

function gatherHourlyData(data) {

  let hourlyWeatherData = [];
  data.forEach((hourlyObject) => {

    hourlyWeatherData.push([hourlyObject.DateTime, hourlyObject.HasPrecipitation, hourlyObject.IsDaylight]);
  })

  checkHourlyData(hourlyWeatherData);
}


function checkHourlyData(data){

  let filteredHourlyData = data.filter(array => array[1] === false).filter(array => array[2] === true);

  console.log(filteredHourlyData);
}



const formConditions = document.querySelector(".conditions");
const twelveHoursFromNow = () => {
  let currentTime = new Date().getHours();

  for (let i = 0; i < 12; i++) {
    if (currentTime + i === 24) {
      currentTime = 0;
      labelSlots[i].textContent = `${currentTime}:00`;
      hourSlots[i].value = currentTime;
      console.log(currentTime);

      currentTime = currentTime - i;
    } else {
      labelSlots[i].textContent = `${currentTime + i}:00`;
      hourSlots[i].value = currentTime + i;
      console.log(currentTime + i);
    }
  }
};
twelveHoursFromNow();


// render available time to run and weather during
const availableHours = document.querySelector(".availableHours");
const renderTimeAndWeather = (clickedHour) => {
  const availableHour = document.createElement("div");
  availableHour.innerHTML = `<p> You can run at ${new Date(
    clickedHour.DateTime
  ).getHours()}:00</p>
  <p>${clickedHour.IconPhrase}</p>
  <img src="https://developer.accuweather.com/sites/default/files/${clickedHour.WeatherIcon <= 9
      ? "0" + clickedHour.WeatherIcon
      : clickedHour.WeatherIcon
    }-s.png" alt="">
  <p>${(((clickedHour.Temperature.Value - 32) * 5) / 9).toFixed(1)}°C</p>`;
  availableHours.appendChild(availableHour);
};