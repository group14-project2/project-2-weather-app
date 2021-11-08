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

// 12 HOUR FORECAST
const weatherDataArray = [
  {
    "DateTime": "2021-11-07T18:00:00-05:00",
    "EpochDateTime": 1636326000,
    "WeatherIcon": 36,
    "IconPhrase": "Intermittent clouds",
    "HasPrecipitation": false,
    "IsDaylight": false,
    "Temperature": {
      "Value": 52,
      "Unit": "F",
      "UnitType": 18
    },
    "PrecipitationProbability": 0,
    "MobileLink": "http://www.accuweather.com/en/ca/toronto/m5h/hourly-weather-forecast/55488?day=1&hbhhour=18&lang=en-us",
    "Link": "http://www.accuweather.com/en/ca/toronto/m5h/hourly-weather-forecast/55488?day=1&hbhhour=18&lang=en-us"
  },
  {
    "DateTime": "2021-11-07T19:00:00-05:00",
    "EpochDateTime": 1636329600,
    "WeatherIcon": 7,
    "IconPhrase": "Cloudy",
    "HasPrecipitation": false,
    "IsDaylight": false,
    "Temperature": {
      "Value": 51,
      "Unit": "F",
      "UnitType": 18
    },
    "PrecipitationProbability": 0,
    "MobileLink": "http://www.accuweather.com/en/ca/toronto/m5h/hourly-weather-forecast/55488?day=1&hbhhour=19&lang=en-us",
    "Link": "http://www.accuweather.com/en/ca/toronto/m5h/hourly-weather-forecast/55488?day=1&hbhhour=19&lang=en-us"
  },
  {
    "DateTime": "2021-11-07T20:00:00-05:00",
    "EpochDateTime": 1636333200,
    "WeatherIcon": 36,
    "IconPhrase": "Intermittent clouds",
    "HasPrecipitation": false,
    "IsDaylight": false,
    "Temperature": {
      "Value": 49,
      "Unit": "F",
      "UnitType": 18
    },
    "PrecipitationProbability": 0,
    "MobileLink": "http://www.accuweather.com/en/ca/toronto/m5h/hourly-weather-forecast/55488?day=1&hbhhour=20&lang=en-us",
    "Link": "http://www.accuweather.com/en/ca/toronto/m5h/hourly-weather-forecast/55488?day=1&hbhhour=20&lang=en-us"
  },
  {
    "DateTime": "2021-11-07T21:00:00-05:00",
    "EpochDateTime": 1636336800,
    "WeatherIcon": 35,
    "IconPhrase": "Partly cloudy",
    "HasPrecipitation": false,
    "IsDaylight": false,
    "Temperature": {
      "Value": 48,
      "Unit": "F",
      "UnitType": 18
    },
    "PrecipitationProbability": 0,
    "MobileLink": "http://www.accuweather.com/en/ca/toronto/m5h/hourly-weather-forecast/55488?day=1&hbhhour=21&lang=en-us",
    "Link": "http://www.accuweather.com/en/ca/toronto/m5h/hourly-weather-forecast/55488?day=1&hbhhour=21&lang=en-us"
  },
  {
    "DateTime": "2021-11-07T22:00:00-05:00",
    "EpochDateTime": 1636340400,
    "WeatherIcon": 33,
    "IconPhrase": "Clear",
    "HasPrecipitation": false,
    "IsDaylight": false,
    "Temperature": {
      "Value": 47,
      "Unit": "F",
      "UnitType": 18
    },
    "PrecipitationProbability": 0,
    "MobileLink": "http://www.accuweather.com/en/ca/toronto/m5h/hourly-weather-forecast/55488?day=1&hbhhour=22&lang=en-us",
    "Link": "http://www.accuweather.com/en/ca/toronto/m5h/hourly-weather-forecast/55488?day=1&hbhhour=22&lang=en-us"
  },
  {
    "DateTime": "2021-11-07T23:00:00-05:00",
    "EpochDateTime": 1636344000,
    "WeatherIcon": 34,
    "IconPhrase": "Mostly clear",
    "HasPrecipitation": false,
    "IsDaylight": false,
    "Temperature": {
      "Value": 46,
      "Unit": "F",
      "UnitType": 18
    },
    "PrecipitationProbability": 0,
    "MobileLink": "http://www.accuweather.com/en/ca/toronto/m5h/hourly-weather-forecast/55488?day=1&hbhhour=23&lang=en-us",
    "Link": "http://www.accuweather.com/en/ca/toronto/m5h/hourly-weather-forecast/55488?day=1&hbhhour=23&lang=en-us"
  },
  {
    "DateTime": "2021-11-08T00:00:00-05:00",
    "EpochDateTime": 1636347600,
    "WeatherIcon": 35,
    "IconPhrase": "Partly cloudy",
    "HasPrecipitation": false,
    "IsDaylight": false,
    "Temperature": {
      "Value": 45,
      "Unit": "F",
      "UnitType": 18
    },
    "PrecipitationProbability": 0,
    "MobileLink": "http://www.accuweather.com/en/ca/toronto/m5h/hourly-weather-forecast/55488?day=2&hbhhour=0&lang=en-us",
    "Link": "http://www.accuweather.com/en/ca/toronto/m5h/hourly-weather-forecast/55488?day=2&hbhhour=0&lang=en-us"
  },
  {
    "DateTime": "2021-11-08T01:00:00-05:00",
    "EpochDateTime": 1636351200,
    "WeatherIcon": 36,
    "IconPhrase": "Intermittent clouds",
    "HasPrecipitation": false,
    "IsDaylight": false,
    "Temperature": {
      "Value": 43,
      "Unit": "F",
      "UnitType": 18
    },
    "PrecipitationProbability": 0,
    "MobileLink": "http://www.accuweather.com/en/ca/toronto/m5h/hourly-weather-forecast/55488?day=2&hbhhour=1&lang=en-us",
    "Link": "http://www.accuweather.com/en/ca/toronto/m5h/hourly-weather-forecast/55488?day=2&hbhhour=1&lang=en-us"
  },
  {
    "DateTime": "2021-11-08T02:00:00-05:00",
    "EpochDateTime": 1636354800,
    "WeatherIcon": 35,
    "IconPhrase": "Partly cloudy",
    "HasPrecipitation": false,
    "IsDaylight": false,
    "Temperature": {
      "Value": 43,
      "Unit": "F",
      "UnitType": 18
    },
    "PrecipitationProbability": 0,
    "MobileLink": "http://www.accuweather.com/en/ca/toronto/m5h/hourly-weather-forecast/55488?day=2&hbhhour=2&lang=en-us",
    "Link": "http://www.accuweather.com/en/ca/toronto/m5h/hourly-weather-forecast/55488?day=2&hbhhour=2&lang=en-us"
  },
  {
    "DateTime": "2021-11-08T03:00:00-05:00",
    "EpochDateTime": 1636358400,
    "WeatherIcon": 34,
    "IconPhrase": "Mostly clear",
    "HasPrecipitation": false,
    "IsDaylight": false,
    "Temperature": {
      "Value": 42,
      "Unit": "F",
      "UnitType": 18
    },
    "PrecipitationProbability": 0,
    "MobileLink": "http://www.accuweather.com/en/ca/toronto/m5h/hourly-weather-forecast/55488?day=2&hbhhour=3&lang=en-us",
    "Link": "http://www.accuweather.com/en/ca/toronto/m5h/hourly-weather-forecast/55488?day=2&hbhhour=3&lang=en-us"
  },
  {
    "DateTime": "2021-11-08T04:00:00-05:00",
    "EpochDateTime": 1636362000,
    "WeatherIcon": 33,
    "IconPhrase": "Clear",
    "HasPrecipitation": false,
    "IsDaylight": false,
    "Temperature": {
      "Value": 42,
      "Unit": "F",
      "UnitType": 18
    },
    "PrecipitationProbability": 0,
    "MobileLink": "http://www.accuweather.com/en/ca/toronto/m5h/hourly-weather-forecast/55488?day=2&hbhhour=4&lang=en-us",
    "Link": "http://www.accuweather.com/en/ca/toronto/m5h/hourly-weather-forecast/55488?day=2&hbhhour=4&lang=en-us"
  },
  {
    "DateTime": "2021-11-08T05:00:00-05:00",
    "EpochDateTime": 1636365600,
    "WeatherIcon": 33,
    "IconPhrase": "Clear",
    "HasPrecipitation": false,
    "IsDaylight": false,
    "Temperature": {
      "Value": 41,
      "Unit": "F",
      "UnitType": 18
    },
    "PrecipitationProbability": 0,
    "MobileLink": "http://www.accuweather.com/en/ca/toronto/m5h/hourly-weather-forecast/55488?day=2&hbhhour=5&lang=en-us",
    "Link": "http://www.accuweather.com/en/ca/toronto/m5h/hourly-weather-forecast/55488?day=2&hbhhour=5&lang=en-us"
  }
]


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
