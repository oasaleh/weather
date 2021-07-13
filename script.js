/* ------------------------------- variables ------------------------------- */
const locationSearch = document.getElementById('locationSearch');
const condition = document.getElementById('condition');
const country = document.getElementById('country');
const city = document.getElementById('city');
const date = document.getElementById('date');
const temp = document.getElementById('temp');
const feelsLike = document.getElementById('feelsLike');
const icon = document.getElementById('weatherIcon');

/* -------------------------------- functions ------------------------------- */
// Call weather API and return object weather with data
async function callWeatherAPI(location, units = 'metric') {
  APIKey = '37d6c6c2278f9294b160a63118b268fe';
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${APIKey}&units=${units}`,
    { mode: 'cors' }
  );
  const weather = await response.json();
  console.log(weather);
  //   console.log(weather.weather[0]['description']);
  return weather;
}

// Populate DOM elements with weather data
const renderDOM = async (location, units) => {
  const weather = await callWeatherAPI(location, units);

  // Access condition & capitalize each word
  const weatherCondition = weather.weather[0]['description']
    .toLowerCase()
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');

  // Access icon
  const weatherIcon = weather.weather[0].icon;
  icon.setAttribute('src', 'http://openweathermap.org/img/wn/' + weatherIcon + '@2x.png');

  // Access city
  const weatherCity = weather['name'];

  // Access country
  let weatherCountry = '';
  if (weather.sys.country == 'IL') {
    weatherCountry = 'PS';
  } else {
    weatherCountry = weather.sys.country;
  }

  // Access temperature
  const weatherTemp = Math.round(weather.main.temp);
  const weatherFeelsLike = weather.main.feels_like;

  // Assign variables
  temp.innerText = weatherTemp + '°';
  feelsLike.innerText = weatherFeelsLike;
  condition.innerText = weatherCondition;
  country.innerText = weatherCountry;
  city.innerText = weatherCity;
  date.innerText = new Date().toDateString();

  console.log(weatherCondition);
  console.log(condition);
  console.log(weatherIcon);
};

/* --------------------------- keys -------------------------- */
// Assign the value inside the search box to variable locationSearch and call weatherAPI with it
locationSearch.addEventListener('keyup', function (e) {
  if (e.key === 'Enter' && locationSearch.value != '') {
    const locationName = locationSearch.value;

    renderDOM(locationName);
    locationSearch.value = '';
  }
  if (locationSearch.value == '') {
    console.log('Search must be in the form of "City", "City, State" or "City, Country".');
  }
});

renderDOM('medina');
