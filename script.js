/* ------------------------------- variables ------------------------------- */
const locationData = new Object();
locationData.APIKey = '37d6c6c2278f9294b160a63118b268fe';
locationData.units = 'metric';
const searchInput = document.getElementById('locationSearch');
const errorMessage = document.getElementById('errorMessage');
/* -------------------------------- functions ------------------------------- */
// Process/determine search filed input and return locationData object with identifying information
function processSearchInput(searchInput) {
  if (/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(searchInput)) {
    locationData.zipCode = searchInput;
    return locationData;
  } else if (searchInput.includes(',')) {
    const cityState = searchInput.split(',');
    if (cityState.length < 3) {
      locationData.cityName = cityState[0];
      locationData.stateCode = cityState[1];
      return locationData;
    } else {
      console.log('Please use a comma in-between city and state names!');
    }
  } else if (!/[^a-z\s]/i.test(searchInput)) {
    locationData.cityName = searchInput;
    return locationData;
  } else {
    // console.log(locationData);
    console.log('Please enter a ZIP code, city or city, state!');
  }
}
// Call OpenWeather API with locationData object and return weather object
async function callWeatherAPI(processedSearchInput) {
  if (processedSearchInput == undefined) {
    console.log('processed data wrong!')
  }
  try {
    if ('zipCode' in processedSearchInput) {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?zip=${processedSearchInput.zipCode}&appid=${processedSearchInput.APIKey}&units=${processedSearchInput.units}`,
        {
          mode: 'cors',
        }
      );
      const weather = await response.json();
      // console.log(weather);
      return weather;
    } else if ('stateCode' in processedSearchInput && 'cityName' in processedSearchInput) {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${processedSearchInput.cityName},${processedSearchInput.stateCode}&appid=${processedSearchInput.APIKey}&units=${processedSearchInput.units}`,
        {
          mode: 'cors',
        }
      );
      const weather = await response.json();
      // console.log(weather);
      return weather;
    } else if (!('stateCode' in processedSearchInput) && 'cityName' in processedSearchInput) {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${processedSearchInput.cityName}&appid=${processedSearchInput.APIKey}&units=${processedSearchInput.units}`,
        {
          mode: 'cors',
        }
      );
      const weather = await response.json();
      // console.log(weather);
      return weather;
    }
  } catch (error) {
    console.error(error);
  }
}
// Call OpenWeather Forecast API and return weather object
async function callForecastAPI(weatherObj) {
  if (weatherObj == undefined) {
    // throw Error(400);
  }
  try {
    // console.log(weatherObj);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${weatherObj.coord.lat}&lon=${weatherObj.coord.lon}&appid=${locationData.APIKey}&units=${locationData.units}`
    );
    const weatherForecast = await response.json();
    // console.log(weatherForecast);
    return weatherForecast;
  } catch (error) {
    console.error(error);
  }
}
async function renderDOM(weather, weatherForecast) {
  // Render date
  const date = document.getElementById('date');
  timezone = weatherForecast.timezone;
  // console.log(timezone);
  // date.innerText = moment().tz(timezone).format();
  // date.innerText = new Date().toDateString("en-US", { timeZone: timezone });
  date.innerText = new Date().toLocaleString('en-US', { dateStyle: 'full', timeZone: timezone });
  // console.log(new Date().toLocaleString("en-US", {timeZone: "America/New_York"}))

  // Render current temperature
  const currentTemp = Math.round(weatherForecast.current.temp);
  const temp = document.getElementById('temp');
  // console.log(currentTemp);
  temp.innerText = currentTemp + '°';

  // Render city and country
  const city = document.getElementById('city');
  const country = document.getElementById('country');
  const weatherCity = weather['name'];
  let weatherCountry = '';
  if (weather.sys.country == 'IL') {
    weatherCountry = ', PS';
  } else {
    weatherCountry = ', ' + weather.sys.country;
  }
  country.innerText = weatherCountry;
  city.innerText = weatherCity;

  // Render current condition description
  const condition = document.getElementById('condition');
  const currentCondition = weatherForecast.current.weather[0].description
    .toLowerCase()
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');
  condition.innerText = currentCondition;
  //Render weather icon
  const icon = document.getElementById('weatherIcon');
  const currentIcon = weather.weather[0].icon;
  icon.setAttribute('src', 'https://openweathermap.org/img/wn/' + currentIcon + '@2x.png');

  // Render daily temperatures
  const forecast = document.getElementById('dailyForecast');
  clearNode(forecast);
  weatherForecast.daily.forEach((day) => {
    const dailyTemp = document.createElement('div');
    dailyTemp.setAttribute('class', 'dailyForecast');
    dailyTemp.innerText = Math.round(day.temp.eve) + '°';
    forecast.append(dailyTemp);
  });
}

function clearNode(node) {
  // console.log(node);
  node.textContent = '';
}

function showErrorMessage() {
  const message = 'try Los Angeles, CA or Houston or 55486!'
  errorMessage.innerText = message
}
/* --------------------------- keys -------------------------- */
// Assign the value inside the search box to variable locationSearch and call
// weatherAPI with it
searchInput.addEventListener('keyup', async function (e) {
  if (e.key === 'Enter' && searchInput.value != '') {
    const location = searchInput.value;
    const processedData = processSearchInput(location);
    const weather = await callWeatherAPI(processedData).catch(console.error.bind(console));
    const weatherForecast = await callForecastAPI(weather);
    renderDOM(weather, weatherForecast);

    locationSearch.value = '';
  }
});

async function init(location = 'jerusalem') {
  const processedData = processSearchInput(location);
  const weather = await callWeatherAPI(processedData);
  const weatherForecast = await callForecastAPI(weather);
  renderDOM(weather, weatherForecast);
  showErrorMessage()
  locationSearch.value = '';
}

init();

