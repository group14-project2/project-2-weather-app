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

function gatherHourlyData(data) {

  let hourlyWeatherData = [];
  data.forEach((hourlyObject) => {

    hourlyWeatherData.push([hourlyObject.HasPrecipitation, hourlyObject.IsDaylight]);
  })

  displayHourlyDaya(hourlyWeatherData);
}




function displayHourlyDaya(hourlyArray) {


  const resultsDiv = document.querySelector('.results');

  hourlyArray.forEach((subArray) => {

    const hourItem = document.createElement("li");


    if (subArray[0] === true) {
      hourItem.classList.add("rain")
      hourItem.innerText = '☔';
    } else {
      hourItem.innerText = '🍂';
    }

    if (subArray[1] === false) {
      hourItem.classList.add("night")
      hourItem.innerText = hourItem.innerText + ' 🌚';
    } else {
      hourItem.innerText = hourItem.innerText + ' 🌞';
    }

    resultsDiv.appendChild(hourItem);
  })
}




// function getHourFromISOTime(isoTime) {
//   return isoTime.substring(11, 16)
// }

// Hackey way of getting 12 hours from now
function getHours() {

  let currentHour = new Date().getHours();
  // let placeholderDate = new Date(`December 25, 1995 ${currentHour}:00:00`).getHours();
  const hourBtnsDiv = document.querySelector('.hour-btns');

  for (i = 1; i < 13; i++) {
    let placeholderDate = new Date(`May 25, 1995 ${currentHour + i}:00:00`).getHours();

    console.log(`${placeholderDate}:00`);
    const hourButton = document.createElement("button");
    hourButton.innerText = `${placeholderDate}:00`;
    hourBtnsDiv.appendChild(hourButton);
    hourBtnsDiv.appendChild(document.createElement("br"));

  }
}

getHours();






const rainBtn = document.querySelector('#rain-btn');
const nightBtn = document.querySelector('#night-btn');

[rainBtn, nightBtn].forEach((button) => {
  button.addEventListener("click", (e) => {
    changButtonContent(button);
  });
})



function changButtonContent(btn) {
  // alert('trying to change thigns');

  const btnLogic = {
    'true': 'Willing ',
    'false': 'Not willing ',
  }

  const btnText = {
    'rain-btn': ["🍂" , '☔', 'to walk in rain'],
    'night-btn': [ "🌞", "🌚", 'to walk at night']
  }

  if (btn.value === 'true') {
    btn.value = 'false';
    // newSentence =  btnText[btn.id][0] + btnLogic['false'] + btnText[btn.id][2];
    btn.children[0].innerText = btnText[btn.id][0];
    btn.children[1].innerText = btnLogic['false'] + btnText[btn.id][2];
  } else {
    btn.value = 'true';
    // newSentence = btnText[btn.id][1] + btnLogic['true'] + btnText[btn.id][2];
    btn.children[0].innerText = btnText[btn.id][1];
    btn.children[1].innerText = btnLogic['true'] + btnText[btn.id][2];
  }
}
