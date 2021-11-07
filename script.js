const APIKey = `Yg5Pb3GrHb1awx4HUiPxk38hOagvNs3Y`;
const body = document.querySelector("body");
const inputLocation = document.querySelector(".inputLocation");
const submitLocation = document.querySelector(".submitLocation");
const availableCities = document.querySelector(".availableCities");
const listOfCities = document.querySelector(".listOfCities");
// const labelSlots = document.querySelectorAll(".labelSlot");
// const hourSlots = document.querySelectorAll(".hourSlot");
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
    const cityItem = document.createElement("a");
    cityItem.innerHTML = `<p>${city.LocalizedName}, ${city.AdministrativeArea.LocalizedName}, <span>${city.Country.LocalizedName}</span</p>`;
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

// a function that grabs the right element from weather api array based on the matching time chosen for 'Hours of Availability'
const matchedValue = (arrData, value) => {
  const dataValue = arrData.find((element) => {
    console.log(new Date(element.DateTime).getHours(), element.DateTime);
    // console.log(Number(value));

    return new Date(element.DateTime).getHours() === Number(value);
  });
  console.log(dataValue);

  return dataValue;
};

// // use location key to find weather for the location
const getWeather = async (locationKey) => {
  const baseUrl = `https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=${APIKey}`;
  const response = await fetch(baseUrl);
  const data = await response.json();
  console.log(data);

  // condition if you still want to run while raining, sun down, or both
  if (isRaining.checked && isSunDown.checked) {
    // render div showing available hour slots to run using renderTimeAndWeather()
    hourSlots.forEach((hour) => {
      if (hour.checked) {
        renderTimeAndWeather(matchedValue(data, hour.value));
      }
    });

    console.log("isRaining.checked && isSunDown.checked");
  }
  // condition if you dont want to run while raining, but okay when sun is down

  if (!isRaining.checked && isSunDown.checked) {
    // filter api data array to match condition
    const notRainingDayOrNight = data.filter((hour) => {
      return !hour.HasPrecipitation;
    });

    console.log("notRainingDayOrNight", notRainingDayOrNight);
    // render div showing available hour slots to run using renderTimeAndWeather()
    hourSlots.forEach((hour) => {
      if (hour.checked) {
        if (matchedValue(notRainingDayOrNight, hour.value)) {
          renderTimeAndWeather(matchedValue(notRainingDayOrNight, hour.value));
        }
      }
    });
  }
  // condition if you want to run while raining but not when sun is down
  if (isRaining.checked && !isSunDown.checked) {
    // filter api data array to match condition
    const notNight = data.filter((hour) => {
      console.log(hour.IsDaylight);

      return hour.IsDaylight;
    });
    console.log("notNight:", notNight);

    // render div showing available hour slots to run using renderTimeAndWeather()
    hourSlots.forEach((hour) => {
      if (hour.checked) {
        if (matchedValue(notNight, hour.value)) {
          renderTimeAndWeather(matchedValue(notNight, hour.value));
        }
      }
    });
  }

  // condition if you want to run when its not raining and only when the sun is up
  if (!isRaining.checked && !isSunDown.checked) {
    // filter api data array to match condition
    notRainingAndNotNight = data
      .filter((hour) => {
        return hour.IsDaylight;
      })
      .filter((hour) => {
        return !hour.HasPrecipitation;
      });

    console.log("notRainingAndNotNight", notRainingAndNotNight);

    // render div showing available hour slots to run using renderTimeAndWeather()
    hourSlots.forEach((hour) => {
      if (hour.checked) {
        if (matchedValue(notRainingAndNotNight, hour.value)) {
          renderTimeAndWeather(matchedValue(notRainingAndNotNight, hour.value));
        }
      }
    });
  }
};

// render available time to run and weather during
const availableHours = document.querySelector(".availableHours");
const renderTimeAndWeather = (clickedHour) => {
  const availableHour = document.createElement("div");
  availableHour.innerHTML = `<p> You can run at ${new Date(
    clickedHour.DateTime
  ).getHours()}:00</p>
  <p>${clickedHour.IconPhrase}</p>
  <img src="https://developer.accuweather.com/sites/default/files/${
    clickedHour.WeatherIcon <= 9
      ? "0" + clickedHour.WeatherIcon
      : clickedHour.WeatherIcon
  }-s.png" alt="">
  <p>${(((clickedHour.Temperature.Value - 32) * 5) / 9).toFixed(1)}°C</p>`;
  availableHours.appendChild(availableHour);
};








// grabs current date and time and puts the time label on the 'Hours of Availability' checkbox
// it also puts a input.value on the ckeckbox that equals the time label
const formConditions = document.querySelector(".conditions");
const twelveHoursFromNow = () => {
  let currentTime = new Date().getHours();
  let extraHour = 0;
  
  document.querySelectorAll('.labelSlot').forEach((label)=>{
    label.textContent = `${currentTime + extraHour}:00`;
    extraHour += 1;
  })

  extraHour = 0;
  document.querySelectorAll(".hourSlot").forEach((checkboxInput) => {
    checkboxInput.value = `${currentTime + extraHour}:00`;
    extraHour += 1;
  })
};
twelveHoursFromNow();
