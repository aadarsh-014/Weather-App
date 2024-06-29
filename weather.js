// Selecting all the necessary elements
const usertab = document.querySelector("[data-userweather]");
const searchtab = document.querySelector("[data-searchweather]");
const usercontainer = document.querySelector(".weather-container");
const grantaccesscontainer = document.querySelector(".grant-location-container");
const searchform = document.querySelector("[data-searchform]");
const loadingscreen = document.querySelector(".loading-container");
const userinfocontainer = document.querySelector(".user-info-container");

// Initial variables
let currenttab = usertab;
const API_KEY = "e1f7af8df574c956275e46c63a05bce3";
currenttab.classList.add("current-tab");
getfromsessionstorage();

function switchtab(clickedtab) {
    if (clickedtab != currenttab) {
        currenttab.classList.remove("current-tab");
        currenttab = clickedtab;
        currenttab.classList.add("current-tab");

        if (!searchform.classList.contains("active")) {
            userinfocontainer.classList.remove("active");
            grantaccesscontainer.classList.remove("active");
            searchform.classList.add("active");
        } else {
            searchform.classList.remove("active");
            userinfocontainer.classList.remove("active");
            getfromsessionstorage();
        }
    }
}

usertab.addEventListener("click", () => {
    switchtab(usertab);
});

searchtab.addEventListener("click", () => {
    switchtab(searchtab);
});

function getfromsessionstorage() {
    const localcoordinates = sessionStorage.getItem("user-coordinates");
    if (!localcoordinates) {
        grantaccesscontainer.classList.add("active");
    } else {
        const coordinates = JSON.parse(localcoordinates);
        fetchusercoordinates(coordinates);
    }
}

async function fetchusercoordinates(coordinates) {
    const { lat, lon } = coordinates;
    grantaccesscontainer.classList.remove("active");
    loadingscreen.classList.add("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        loadingscreen.classList.remove("active");
        userinfocontainer.classList.add("active");
        renderweatherinfo(data, "user");
    } catch (err) {
        console.error("Error fetching weather data:", err);
        loadingscreen.classList.remove("active");
    }
}

function renderweatherinfo(weatherinfo, type) {
    const cityname = document.querySelector("[data-cityname]");
    const countryicon = document.querySelector("[data-countryicon]");
    const desc = document.querySelector("[data-weatherdisc]");
    const weathericon = document.querySelector("[data-weathericon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-clouds]");

    if (type === "user") {
        cityname.innerText = weatherinfo?.name || "N/A";
        countryicon.src = `https://flagcdn.com/144x108/${weatherinfo?.sys?.country.toLowerCase()}.png`;
        desc.innerText = weatherinfo?.weather?.[0]?.description || "N/A";
        weathericon.src = `https://openweathermap.org/img/w/${weatherinfo?.weather?.[0]?.icon}.png`;
        temp.innerText = `${weatherinfo?.main?.temp}°C` || "N/A";
        windspeed.innerText = `${weatherinfo?.wind?.speed} m/s` || "N/A";
        humidity.innerText = `${weatherinfo?.main?.humidity}%` || "N/A";
        cloudiness.innerText = `${weatherinfo?.clouds?.all}%` || "N/A";
    } else {
        cityname.innerText = weatherinfo?.name || "N/A";
        countryicon.src = `https://flagcdn.com/144x108/${weatherinfo?.sys?.country.toLowerCase()}.png`;
        desc.innerText = weatherinfo?.weather?.[0]?.description || "N/A";
        weathericon.src = `https://openweathermap.org/img/w/${weatherinfo?.weather?.[0]?.icon}.png`;
        temp.innerText = `${weatherinfo?.main?.temp}°C` || "N/A";
        windspeed.innerText = `${weatherinfo?.wind?.speed} m/s` || "N/A";
        humidity.innerText = `${weatherinfo?.main?.humidity}%` || "N/A";
        cloudiness.innerText = `${weatherinfo?.clouds?.all}%` || "N/A";
    }

    console.log("Weather information:", weatherinfo); // Debug log
}

function getlocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showposition);
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}

function showposition(position) {
    const usercoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    };

    sessionStorage.setItem("user-coordinates", JSON.stringify(usercoordinates));
    fetchusercoordinates(usercoordinates);
}

const grantaccessbutton = document.querySelector("[data-grantaccess]");
grantaccessbutton.addEventListener("click", getlocation);

let searchinput = document.querySelector("[data-searchinput]");
searchform.addEventListener("submit", (e) => {
    e.preventDefault();
    if (searchinput.value === "") return;

    fetchsearchweatherinfo(searchinput.value);
});

async function fetchsearchweatherinfo(city) {
    loadingscreen.classList.add("active");
    userinfocontainer.classList.remove("active");
    grantaccesscontainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        loadingscreen.classList.remove("active");
        userinfocontainer.classList.add("active");
        renderweatherinfo(data, "search");
    } catch (err) {
        console.error("Error fetching weather data:", err);
        loadingscreen.classList.remove("active");
    }
}
