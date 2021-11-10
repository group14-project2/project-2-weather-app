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

  // displayHourlyData(hourlyWeatherData);
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
  })
}
// change debug12Hour parameter to hourlyArray when done
// and uncomment displayHourlyData call in getWeather function
displayHourlyData(debug12hour);


// Hackey way of getting 12 hours from now
function getHours() {

  let currentHour = new Date().getHours();
  const hourBtnsDiv = document.querySelector('.hour-btns');

  for (i = 1; i < 13; i++) {

    let hour = (currentHour + i) % 24;
    const hourButton = document.createElement("button");

    hourButton.innerText = `${hour}:00`;
    hourBtnsDiv.appendChild(hourButton);
    // hourBtnsDiv.appendChild(document.createElement("br"));

  }
}

getHours();






const rainBtn = document.querySelector('#rain');
const nightBtn = document.querySelector('#night');

[rainBtn, nightBtn].forEach((button) => {
  button.addEventListener("click", (e) => {
    changButtonContent(button);
    addHighlight(button);
  });
})



function changButtonContent(btn) {

  const btnLogic = {
    'true': 'Willing ',
    'false': 'Not willing ',
  }

  const btnText = {
    'rain': ["🍂", '☔', 'to walk in rain'],
    'night': ["🌞", "🌚", 'to walk at night']
  }

  // dont change button value right here, b/c addHighlight need the value of the button prior to the click
  if (btn.value === 'true') {
    btn.innerText = btnText[btn.id][0] + ' ' + btnLogic['false'] + btnText[btn.id][2];
  } else {
    btn.innerText = btnText[btn.id][1] + ' ' + btnLogic['true'] + btnText[btn.id][2];
  }
}


function addHighlight(button) {

  // WILLING TO WALK === REMOVE HIGHLIGHT
  // NOT WILLING TO WALK === ADD HIGHLIGHT

  let elementWithClass = Array.from(document.getElementsByClassName(button.id));

  // button.value === 'true' ? button.value = 'false' : button.value = 'true';

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





  // console.log(button);
  console.log(elementWithClass);

  // if (addHighlight === true) {

  //   Array.from(document.getElementsByClassName(classname)).forEach((element) => {
  //     element.className = `${classname}-highlight`;
  //   })

  // }else if(addHighlight === false) {
  //   Array.from(document.getElementsByClassName(classname)).forEach((element) => {
  //     element.classList.remove(`${classname}-highlight`);
  //   })
  // }
}
