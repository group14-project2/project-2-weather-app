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

      // ===========NEW QOL IMPROV====================
      // remove lsit cities once user selects
      listOfCities.innerHTML = '';

      // clear previous 12 weather results
      document.querySelector('.results').innerHTML = '';
      // ===========NEW QOL IMPROV====================
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



// good for debugging/testing highlights
sudburyData = [
  [
    false,
    true
  ],
  [
    false,
    true
  ],
  [
    true,
    true
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
    true,
    false
  ],
  [
    true,
    false
  ],
  [
    true,
    false
  ],
  [
    true,
    false
  ],
  [
    true,
    false
  ],
  [
    true,
    false
  ],
  [
    true,
    false
  ]
];


// scrape rain and daylight info from each of the 12 weather objects into an array, then add the 12 subarrays into a containing array and pass that to displayHourData()
function gatherHourlyData(data) {

  let hourlyWeatherData = [];
  data.forEach((hourlyObject) => {

    hourlyWeatherData.push([hourlyObject.HasPrecipitation, hourlyObject.IsDaylight]);
  })

  // UNCOMMENT TO GET BOOLEAN WEATHER DATA ARRAY
  // console.log(hourlyWeatherData)
  // displayHourlyData(hourlyWeatherData);
  displayHourlyData(sudburyData);
}



// apply two functions onto the rain and night button
// first function changes the text content inside the button
// second function and add/remove .rain-highlight/.night-highlight from the hourly weather data to match user's preference, and changes the value/id of the button to match the sematic meanings of text inside button for program logic
const rainBtn = document.querySelector('#rain');
const nightBtn = document.querySelector('#night');

[rainBtn, nightBtn].forEach((button) => {
  button.addEventListener("click", () => {
    addOrRemoveHighlight(button);
    changButtonContent(button);
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
  })

  // once all hourly data is displayed, check if either buttons text content have changed/ie buttons were clicked from the default 'will walk in rain/at night', and highlight appropriate data
  if (rainBtn.innerText === "🍂 Not willing to walk in rain") {
    addOrRemoveHighlight(rainBtn)
  }
  if (nightBtn.innerText === "🌞 Not willing to walk at night") {
    addOrRemoveHighlight(nightBtn)
  }
}


// unhighlight/highlight elements by adding/removing .rain-highlight to elements with class .rain (ditto with .night-highlight/.night)
// adding/removing is based on the value of the rainBtn/nightBtn ('true'/'false'), which reflects the user's preference
function addOrRemoveHighlight(button) {

  // ${buttin.id} is either string of "rain" or "night"
  // get all elements with .rain/.night class, and turn them into an array to apply/remove the class rain-/night-highlight from
  let elementWithClass = Array.from(document.getElementsByClassName(button.id));

  elementWithClass.forEach((element) => {
    element.classList.toggle(`${button.id}-highlight`);
  })
}


// construct new text inside the button
function changButtonContent(btn) {

  const a = "☔ Willing to walk in rain";
  const b = "🍂 Not willing to walk in rain";
  const c = "🌚 Willing to walk at night";
  const d = "🌞 Not willing to walk at night";

  // basically swap strings for the opposite related one 
  // sub in the string to clear up semantic meanings
  if (btn.id === 'rain') {
    btn.innerText === a ? btn.innerText = b : btn.innerText = a;
  } else {
    btn.innerText === c ? btn.innerText = d : btn.innerText = c;
  }
}


