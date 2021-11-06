const APIKey = `gm7s0qdKp0IsRCbkhFPinoClGBWUxRND`;
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

// // get from an api and its location key
const getLocation = async (location) => {
  const baseUrl = `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${APIKey}&q=${location}`;
  const response = await fetch(baseUrl);
  const data = await response.json();
  // filter for appropriate city
  renderCities(data);
};
// // use location key to find weather for the location
const getWeather = async (locationKey) => {
  const baseUrl = `https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=${APIKey}`;
  const response = await fetch(baseUrl);
  const data = await response.json();
  console.log(data);
  // firstHour is calculated to subtract to checkbox values to get the accurate value for rendering accurate time and weather
  const firstHour = new Date(data[0].DateTime).getHours();
  console.log(firstHour);

  // condition if you still want to run while raining, sun down, or both
  if (isRaining.checked && isSunDown.checked) {
    // render div showing available hour slots to run
    hourSlots.forEach((hour) => {
      if (hour.checked) {
        renderTimeAndWeather(data[hour.value - firstHour]);
      }
    });
    console.log("isRaining.checked && isSunDown.checked");
  }
  // condition if you dont want to run while raining, but okay when sun is down

  if (!isRaining.checked && isSunDown.checked) {
    const notRainingDayOrNight = data.filter((hour) => {
      console.log(!hour.HasPrecipitation);

      return !hour.HasPrecipitation;
    });

    // render div showing available hour slots to run
    hourSlots.forEach((hour) => {
      if (hour.checked) {
        renderTimeAndWeather(notRainingDayOrNight[hour.value - firstHour]);
      }
    });
    console.log("notRainingDayOrNight", notRainingDayOrNight);
  }
  // condition if you want to run while raining but not when sun is down
  if (isRaining.checked && !isSunDown.checked) {
    const notNight = data.filter((hour) => {
      console.log(hour.IsDaylight);

      return hour.IsDaylight;
    });
    // render div showing available hour slots to run

    hourSlots.forEach((hour) => {
      if (hour.checked) {
        renderTimeAndWeather(notNight[hour.value - firstHour]);
      }
    });
    console.log("notNight:", notNight);
  }

  // render div showing available hour slots to run
  hourSlots.forEach((hour) => {
    if (hour.checked) {
      renderTimeAndWeather(data[hour.value - firstHour]);
    }
  });
};
// render available cities matching the input
const renderCities = (cities) => {
  // makes a list of cities
  cities.forEach((city) => {
    const cityItem = document.createElement("li");
    cityItem.innerHTML = `<p>${city.LocalizedName}, <span>${city.Country.LocalizedName}</span</p>`;
    cityItem.id = city.Key;

    cityItem.addEventListener("click", () => {
      // whenever you click on a city it will trigger getWeather() that gets that weather for the city you clicked
      getWeather(cityItem.id);
      // removes list of cities from the screen once you choose one
      body.removeChild(availableCities);
    });

    listOfCities.appendChild(cityItem);
  });
};

// render available time to run and weather during
const availableHours = document.querySelector(".availableHours");
const renderTimeAndWeather = (availableHour) => {
  console.log(availableHour);

  const hour = document.createElement("div");
  hour.innerHTML = `<p> You can run at ${new Date(
    availableHour.DateTime
  ).getHours()}:00;</p>
  <img src="https://developer.accuweather.com/sites/default/files/${
    availableHour.WeatherIcon <= 9
      ? "0" + availableHour.WeatherIcon
      : availableHour.WeatherIcon
  }-s.png" alt="">
  <p>${availableHour.IconPhrase}</p>
  <p>${(((availableHour.Temperature.Value - 32) * 5) / 9).toFixed(1)}°C</p>`;

  console.log(availableHour.IconPhrase);
  availableHours.appendChild(hour);
};

// grab current date and time
const formConditions = document.querySelector(".conditions");
const twelveHoursFromNow = () => {
  let currentTime = new Date().getHours() + 1;

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
