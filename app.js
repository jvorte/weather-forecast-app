// https://home.openweathermap.org/api_keys

// current location (autoload)  

window.onload = function() {
    
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const apiKey =  '80bc431b264770e12fdc9d64ede97a8d'; // Α API Key 
                const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    
                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        if (data.cod === 200) {
                            displayCurrentWeatherData(data);
                        } else {
                            alert('Location not found');
                        }
                    })
                    .catch(error => {
                        alert('Error fetching weather data');
                        console.error(error);
                    });
            }, function () {
                alert('Geolocation not supported or permission denied');
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    
    
};

document.getElementById('getWeatherBtn').addEventListener('click', getWeather);


function getWeather() {
    const city = document.getElementById('city').value;
    
    const apiKey = '80bc431b264770e12fdc9d64ede97a8d'; // API Key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                displayWeatherData(data);
            } else {
                alert('City not found');
            }
        })
        .catch(error => {
            alert('Error fetching weather data');
            console.error(error);
        });

 
}

// current location Weather Data

function displayCurrentWeatherData(data) {
    document.getElementById('currentcityName').textContent = data.name;
    document.getElementById('currenttemp').textContent = data.main.temp;


    // Προσθήκη εικόνας καιρού
    const iconCode = data.weather[0].icon;
    document.getElementById('currentweatherIcon').src = `https://openweathermap.org/img/wn/${iconCode}.png`;
    document.getElementById('currentweatherIcon').style.display = 'block'; // Εμφάνιση εικόνας

   
}
;



// display Weather Data

function displayWeatherData(data) {
    document.getElementById('cityName').textContent = data.name;
    document.getElementById('temp').textContent = data.main.temp;
    document.getElementById('humidity').textContent = data.main.humidity;
    document.getElementById('wind').textContent = data.wind.speed;
    document.getElementById('description').textContent = data.weather[0].description;

    // Προσθήκη εικόνας καιρού
    const iconCode = data.weather[0].icon;
    document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${iconCode}.png`;
    document.getElementById('weatherIcon').style.display = 'block'; // Εμφάνιση εικόνας
    document.getElementById('weatherInfo').style.display = 'block';
}

let isCelsius = true;

document.getElementById('toggleUnits').addEventListener('click', function() {
    isCelsius = !isCelsius;
    localStorage.setItem('temperatureUnit', isCelsius ? 'C' : 'F');
    updateTemperature();
});

//Celsius to Fahrenheit
function updateTemperature() {
    let ids = ["temp", "currenttemp"];
    let tempElements = ids.map(id => document.getElementById(id));

    // Μετατροπή θερμοκρασιών στα κύρια στοιχεία
    tempElements.forEach(tempElement => {
        if (!tempElement) return;

        let currentTemp = parseFloat(tempElement.textContent);
        if (isNaN(currentTemp)) return;

        if (isCelsius) {
            tempElement.textContent = ((currentTemp - 32) * 5 / 9).toFixed(1); // Δεν προσθέτουμε μονάδα θερμοκρασίας
        } else {
            tempElement.textContent = ((currentTemp * 9 / 5) + 32).toFixed(1); // Δεν προσθέτουμε μονάδα θερμοκρασίας
        }
    });

    // Ενημέρωση της μονάδας θερμοκρασίας στην ετικέτα
    document.getElementById('unitLabel').textContent = isCelsius ? '°C' : '°F';

    // Μετατροπή θερμοκρασιών στην πρόγνωση
    document.querySelectorAll('.forecast-item p:last-child').forEach(tempElement => {
        let currentTemp = parseFloat(tempElement.textContent);
        if (isNaN(currentTemp)) return;

        if (isCelsius) {
            tempElement.textContent = ((currentTemp - 32) * 5 / 9).toFixed(1) + "°C"; // Ενημερώνουμε το στοιχείο με την μονάδα
        } else {
            tempElement.textContent = ((currentTemp * 9 / 5) + 32).toFixed(1) + "°F"; // Ενημερώνουμε το στοιχείο με την μονάδα
        }
    });
}


// Φόρτωση αποθηκευμένης μονάδας θερμοκρασίας
if (localStorage.getItem('temperatureUnit') === 'F') {
    isCelsius = false;
}


// Πρόγνωση 5 ημερών

// Προσθέτουμε event listener στο κουμπί
document.getElementById('getForecastBtn').addEventListener('click', getFiveDayForecast);

function getFiveDayForecast() {
    const city = document.getElementById('city').value;  // Παίρνουμε την πόλη από το input
    const apiKey = '80bc431b264770e12fdc9d64ede97a8d';  // Το API key σου
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);  // Εμφανίζουμε τα δεδομένα για να τα δούμε
            if (parseInt(data.cod) === 200) {
                displayFiveDayForecast(data);
            } else {
                alert('City not found or error in the forecast');
            }
        })
        .catch(error => {
            alert('Error fetching weather forecast');
            console.error(error);
        });
}

// Συνάρτηση για την εμφάνιση της πρόγνωσης των 5 ημερών
function displayFiveDayForecast(data) {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';  // Καθαρίζουμε το πεδίο εμφάνισης για νέα δεδομένα

    const dailyForecast = {};

    data.list.forEach(entry => {
        const date = entry.dt_txt.split(" ")[0];  // Παίρνουμε μόνο την ημερομηνία (χωρίς ώρα)
        if (!dailyForecast[date]) {
            dailyForecast[date] = {
                temp: entry.main.temp.toFixed(1), // Θερμοκρασία με 1 δεκαδικό
                weather: entry.weather[0].description, 
                icon: entry.weather[0].icon
            };
        }
    });

    Object.keys(dailyForecast).slice(0, 5).forEach(date => {
        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        forecastItem.innerHTML = `
            <p>${new Date(date).toLocaleDateString()}</p>
            <img src="https://openweathermap.org/img/wn/${dailyForecast[date].icon}.png" alt="Weather Icon">
            <p>${dailyForecast[date].weather}</p>
            <p>${dailyForecast[date].temp}°${isCelsius ? 'C' : 'F'}</p> <!-- Προσθήκη μονάδας θερμοκρασίας εδώ -->
        `;
        forecastContainer.appendChild(forecastItem);
    });
}





// ---------------------------------------