const APIKey = `Yg5Pb3GrHb1awx4HUiPxk38hOagvNs3Y`;
const body = document.querySelector("body");
const inputLocation = document.querySelector(".inputLocation");
const submitLocation = document.querySelector(".submitLocation");
const availableCities = document.querySelector(".availableCities");
const listOfCities = document.querySelector(".listOfCities");



// create 12 hour buttons for the next 12 hours
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

// clicking submit calls pass user's input to getLocation()
submitLocation.addEventListener("submit", (e) => {
  e.preventDefault();
  getLocation(inputLocation.value);
});


// IF REQUEST TWICE NEW REQUEST GOES TO BOTTOM
// IMPLEMENT FUNCTION TO CLEAR PREVIOUS REQUEST
// send user's text input to Accuweather's Location API, and pass the returned data to renderCities()
const getLocation = async (location) => {
  const baseUrl = `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${APIKey}&q=${location}`;
  const response = await fetch(baseUrl);
  const data = await response.json();


  renderCities(data);
};


// Accuweather's Location API gives back an array of city objects that matches user input; this function displays the "city name-region-country" of each city object as a <p> for user to click on and get that city's weather forecast; each city <p> is attached with a unique 5-digit id that uniquely identifies a city to Accuweather's Forecast API 
const renderCities = (cities) => {

  cities.forEach((city) => {
    const cityItem = document.createElement("li");
    cityItem.innerHTML = `<p class='clickable'>${city.LocalizedName}, ${city.AdministrativeArea.LocalizedName}, ${city.Country.LocalizedName}</p>`;
    cityItem.id = city.Key;

    // attaches each <p> city element with a handler that sends the <p>'s id, a unique 5-digit, to Accuweather's Forecast API; then the div
    cityItem.addEventListener("click", () => {
      getWeather(cityItem.id);
      body.removeChild(availableCities);
    });

    // appends <p> element to a div to show the user
    listOfCities.appendChild(cityItem);
  });
};



// sends the 5-digit to Accuweather's Forecast API, and get back an array of 12 objects; each object represents hourly forecast from current time to 12 hours into the future  
const getWeather = async (locationKey) => {
  const baseUrl = `https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=${APIKey}`;
  const response = await fetch(baseUrl);
  const data = await response.json();

  gatherHourlyData(data);
}


// scrape rain and daylight info from each of the 12 weather objects into an array, then add the 12 subarrays into a containing array and pass that to displayHourData()
function gatherHourlyData(data) {

  let hourlyWeatherData = [];
  data.forEach((hourlyObject) => {

    hourlyWeatherData.push([hourlyObject.HasPrecipitation, hourlyObject.IsDaylight]);
  })

  displayHourlyData(hourlyWeatherData);
}



// apply two functions onto the rain and night button
// first function changes the text content inside the button
// second function and add/remove .rain-highlight/.night-highlight from the hourly weather data to match user's preference, and changes the value/id of the button to match the sematic meanings of text inside button for program logic
const rainBtn = document.querySelector('#rain');
const nightBtn = document.querySelector('#night');

[rainBtn, nightBtn].forEach((button) => {
  button.addEventListener("click", () => {
    changButtonContent(button);
    addOrRemoveHighlight(button);
  });
})



// convert the array of boolean weather forecast for the next 12 hours into 12 <li> with the appropriate emojis, and attach the appropriate .rain/.night/or both class to eachtwelveWeatherSubArray <li>
function displayHourlyData(twelveWeatherSubArray) {

  // twelveWeatherSubArray takes form of 12 boolean subarrays
  // [[true, false], [true, true], ...]

  const resultsDiv = document.querySelector('.results');

  twelveWeatherSubArray.forEach((subArray) => {

    const hourItem = document.createElement("li");

    // [0] is precipitation data, [1] is daylight data
    if (subArray[0] === true) {
      hourItem.classList.add("rain");
      hourItem.innerText = '☔';
    } else {
      hourItem.innerText = '🍂';
    }

    if (subArray[1] === false) {
      hourItem.classList.add("night");
      hourItem.innerText = hourItem.innerText + ' 🌚';
    } else {
      hourItem.innerText = hourItem.innerText + ' 🌞';
    }

    // append the newly created weather <li>
    resultsDiv.appendChild(hourItem);


    // NEED EXTENSIVE EXPLANATION HERE
    // IF YOU CAN EXPLAIN WHY THIS WORK THREE DRINKS ON ME
    // since we have 12 hour elements, we call this function 12 times for each button; an even number of calls basically cancels out any wonky effect with an odd number of calls
    // to see wonky effect, go to getHourlyWeatherData and sub in the below, which will give 13 weather subarrays, and each line will call 13 times/an odd number of calls
    //  let hourlyWeatherData = [[false, true]];

    // addOrRemoveHighlight(nightBtn);
    // addOrRemoveHighlight(rainBtn);
  })

  

  // [rainBtn, nightBtn].forEach((btn) => {
  //   console.log(btn.value);
  // })
}


// construct new text inside the button
function changButtonContent(btn) {

  const btnLogic = {
    'true': 'Willing ',
    'false': 'Not willing ',
  }

  const btnText = {
    'rain': ["🍂", '☔', 'to walk in rain'],
    'night': ["🌞", "🌚", 'to walk at night']
  }

  // if user clicks on button with true value, means that user do not want to walk in rain/not daylight (ie night) conditions; have to change text inside to say 'Not willing ... to walk...; in rain/at night' is based on the button's id
  if (btn.value === 'true') {
    btn.innerText = btnText[btn.id][0] + ' ' + btnLogic['false'] + btnText[btn.id][2];
  } else {
    btn.innerText = btnText[btn.id][1] + ' ' + btnLogic['true'] + btnText[btn.id][2];
  }
}


// unhighlight/highlight elements by adding/removing .rain-highlight to elements with class .rain (ditto with .night-highlight/.night)
// adding/removing is based on the value of the rainBtn/nightBtn ('true'/'false'), which reflects the user's preference
function addOrRemoveHighlight(button) {

  // get all elements with .rain/.night class, and turn them into an array to apply/remove highlight from
  let elementWithClass = Array.from(document.getElementsByClassName(button.id));

  elementWithClass.forEach((element) => {
    element.classList.toggle(`${button.id}-highlight`);
  })

  button.value === 'true' ? button.value = 'false' : button.value = 'true';
}