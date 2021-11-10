const APIKey = `Yg5Pb3GrHb1awx4HUiPxk38hOagvNs3Y`;
const body = document.querySelector("body");
const inputLocation = document.querySelector(".inputLocation");
const submitLocation = document.querySelector(".submitLocation");
const availableCities = document.querySelector(".availableCities");
const listOfCities = document.querySelector(".listOfCities");



// Hackey way of getting 12 hours from now
function getHours() {

  let currentHour = new Date().getHours();
  const hourBtnsDiv = document.querySelector('.hour-btns');

  for (i = 1; i < 13; i++) {

    let hour = (currentHour + i) % 24;
    const hourButton = document.createElement("button");
    hourButton.innerText = `${hour}:00`;
    hourBtnsDiv.appendChild(hourButton);
  }
}
getHours();




// whenever you press submit, this gets the location, hours of availability and raining/not raining, sun up/down
submitLocation.addEventListener("click", (e) => {
  // using the function getLocation that get location you typed and gets an api of cities
  getLocation(inputLocation.value);
});



// IF REQUEST TWICE NEW REQUEST GOES TO BOTTOM
// IMPLEMENT FUNCTION TO CLEAR PREVIOUS REQUEST
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

function gatherHourlyData(data) {

  let hourlyWeatherData = [];
  data.forEach((hourlyObject) => {

    hourlyWeatherData.push([hourlyObject.HasPrecipitation, hourlyObject.IsDaylight]);
  })

  displayHourlyData(hourlyWeatherData);
}



let debug12hour = [
  [
    true,
    true
  ],
  [
    false,
    true
  ],
  [
    false,
    true
  ],
  [
    false,
    false
  ],
  [
    true,
    false
  ],
  [
    false,
    false
  ],
  [
    false,
    false
  ],
  [
    false,
    false
  ],
  [
    false,
    false
  ],
  [
    false,
    false
  ],
  [
    false,
    false
  ],
  [
    false,
    false
  ]
];


const rainBtn = document.querySelector('#rain');
const nightBtn = document.querySelector('#night');

[rainBtn, nightBtn].forEach((button) => {
  button.addEventListener("click", () => {
    changButtonContent(button);
    addOrRemoveHighlight(button);
  });
})


function displayHourlyData(hourlyArray) {

  // debug12hour = hourlyArray;
  const resultsDiv = document.querySelector('.results');

  hourlyArray.forEach((subArray) => {

    const hourItem = document.createElement("li");

    if (subArray[0] === true) {
      hourItem.classList.add("rain", "rain-highlight");
      hourItem.innerText = '☔';
    } else {
      hourItem.innerText = '🍂';
    }
    
    if (subArray[1] === false) {
      hourItem.classList.add("night", "night-highlight");
      hourItem.innerText = hourItem.innerText + ' 🌚';
    } else {
      hourItem.innerText = hourItem.innerText + ' 🌞';
    }

    resultsDiv.appendChild(hourItem);

    addOrRemoveHighlight(rainBtn);
    addOrRemoveHighlight(nightBtn);
  })
}
// change debug12Hour parameter to hourlyArray when done
// and uncomment displayHourlyData call in getWeather function
// displayHourlyData(debug12hour);


function changButtonContent(btn) {

  const btnLogic = {
    'true': 'Willing ',
    'false': 'Not willing ',
  }

  const btnText = {
    'rain': ["🍂", '☔', 'to walk in rain'],
    'night': ["🌞", "🌚", 'to walk at night']
  }

  if (btn.value === 'true') {
    btn.innerText = btnText[btn.id][0] + ' ' + btnLogic['false'] + btnText[btn.id][2];
  } else {
    btn.innerText = btnText[btn.id][1] + ' ' + btnLogic['true'] + btnText[btn.id][2];
  }
}


function addOrRemoveHighlight(button) {

  let elementWithClass = Array.from(document.getElementsByClassName(button.id));

  if (button.value === 'true') {
    elementWithClass.forEach((element) => {
      element.classList.add(`${button.id}-highlight`)
    })
    button.value = 'false';

  } else {
    elementWithClass.forEach((element) => {
      element.classList.remove(`${button.id}-highlight`)
    })
    button.value = 'true';
  }
}
