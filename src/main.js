import { getWeatherByCity } from './apiService.js';
import { mapListToDOMElements } from './DOMActions.js';

class WeatherApp {
    constructor() {
        this.viewElems = {};
        this.initializeApp();
    }

    initializeApp = () => {
        this.connectDOMElements();
        this.setupListeners();
    }

    connectDOMElements = () => {
        const listOfIds = Array.from(document.querySelectorAll('[id]')).map(elem => elem.id);
        this.viewElems = mapListToDOMElements(listOfIds);
    }

    setupListeners = () => {
        this.viewElems.searchInput.addEventListener('keydown', this.handleSubmit);
        this.viewElems.searchButton.addEventListener('click', this.handleSubmit);
        this.viewElems.returnToSearchBtn.addEventListener('click', this.returnToSearch);
    }

    handleSubmit = () => {
        this.viewElems.searchError.innerText = "";
        this.viewElems.searchInput.style.borderColor = "black";
        if (event.type === 'click' || event.key === 'Enter') {
            this.fadeInOut();
            let query = this.viewElems.searchInput.value;
            getWeatherByCity(query).then(data => {
                this.displayWeatherData(data);
                this.viewElems.searchInput.value = "";
            }).catch((error) => {
                this.fadeInOut();
                this.viewElems.searchInput.style.borderColor = "red";
                this.viewElems.searchError.innerText = "There is no such city";
            })
        }
    }

    fadeInOut = () => {
        if (this.viewElems.mainContainer.style.opacity === '1' || this.viewElems.mainContainer.style.opacity === '') {
            this.viewElems.mainContainer.style.opacity = '0';
        } else {
            this.viewElems.mainContainer.style.opacity = '1';
        }
    }
    
    switchView = () => {
        if (this.viewElems.weatherSearchView.style.display !== 'none') {
            this.viewElems.weatherSearchView.style.display = 'none';
            this.viewElems.weatherForecastView.style.display = 'block';
        } else {
            this.viewElems.weatherSearchView.style.display = 'flex';
            this.viewElems.weatherForecastView.style.display = 'none';
        }
    }

    returnToSearch = () => {
        this.fadeInOut();
        
        setTimeout(() => {
            this.switchView();
            this.fadeInOut();
        }, 500);

        this.viewElems.landingPage.style.backgroundImage = "url(" + `../img/bg/main.jpg` + ")";
    }

    displayWeatherData = (data) => {
        this.switchView();
        this.fadeInOut();
    
        const weather = data.consolidated_weather[0];
    
        console.log(weather);
    
        this.viewElems.weatherCity.innerText = data.title;
        this.viewElems.weatherIcon.src = `https://www.metaweather.com/static/img/weather/${weather.weather_state_abbr}.svg`;
        this.viewElems.weatherIcon.alt = weather.weather_state_name;
        this.viewElems.landingPage.style.backgroundImage = "url(" + `../img/bg/${weather.weather_state_abbr}.jpg` + ")";
    
        const currTemp = weather.the_temp.toFixed(2);
        const maxTemp = weather.max_temp.toFixed(2);
        const minTemp = weather.min_temp.toFixed(2);
        const airPressure = weather.air_pressure.toFixed(0);
    
        this.viewElems.weatherCurrentTemp.innerText = `Current temperature: ${currTemp}??C`;
        this.viewElems.weatherMaxTemp.innerText = `Max temperature: ${maxTemp}??C`;
        this.viewElems.weatherMinTemp.innerText = `Min temperature: ${minTemp}??C`;
        this.viewElems.airPressure.innerText = `Air pressure: ${airPressure} hPa`;
    }
}

class WeatherAppPro extends WeatherApp {
    constructor() {
        super();
        this.colorChange();
    }
    colorChange = () => {
        weatherCurrentTemp.style.color = "red";
    }
}

document.addEventListener("DOMContentLoaded", new WeatherAppPro);
