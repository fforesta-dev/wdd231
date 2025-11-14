const gridViewBtn = document.getElementById('grid-view');
const listViewBtn = document.getElementById('list-view');
const directoryContainer = document.getElementById('directory-container');
const menuToggle = document.getElementById('menu-toggle');
const navigation = document.getElementById('navigation');

let membersData = [];

function initializeNavigation() {
    if (menuToggle && navigation) {
        menuToggle.removeEventListener('click', toggleMenu);

        menuToggle.addEventListener('click', toggleMenu);

        document.addEventListener('click', function (event) {
            if (!navigation.contains(event.target) && !menuToggle.contains(event.target)) {
                navigation.classList.remove('show');
                menuToggle.classList.remove('active');
            }
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                navigation.classList.remove('show');
                menuToggle.classList.remove('active');
            }
        });
    }
}

function toggleMenu(e) {
    e.preventDefault();
    e.stopPropagation();

    console.log('Hamburger clicked');

    navigation.classList.toggle('show');
    menuToggle.classList.toggle('active');

    console.log('Navigation classes:', navigation.classList.toString());
    console.log('Menu toggle classes:', menuToggle.classList.toString());
}

const WEATHER_API_KEY = '92dabf2f8d9c3851bbe133d2b8bcd172';
const TERNI_LAT = 42.57;
const TERNI_LON = 12.67;

const CURRENT_WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${TERNI_LAT}&lon=${TERNI_LON}&units=metric&appid=${WEATHER_API_KEY}`;
const FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${TERNI_LAT}&lon=${TERNI_LON}&units=metric&appid=${WEATHER_API_KEY}`;

if (gridViewBtn && listViewBtn && directoryContainer) {
    gridViewBtn.addEventListener('click', () => {
        directoryContainer.className = 'grid-view';
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
        displayMembers(membersData, 'grid');
    });

    listViewBtn.addEventListener('click', () => {
        directoryContainer.className = 'list-view';
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
        displayMembers(membersData, 'list');
    });
}

async function getMembers() {
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        membersData = data;
        displayMembers(data, 'grid');
    } catch (error) {
        console.error('Error fetching members:', error);
        if (directoryContainer) {
            directoryContainer.innerHTML = '<p>Error loading member data. Please try again later.</p>';
        }
    }
}

function displayMembers(members, viewType) {
    if (!directoryContainer) {
        console.error('Directory container not found');
        return;
    }

    directoryContainer.innerHTML = '';

    members.forEach(member => {
        const memberCard = document.createElement('div');
        memberCard.classList.add('business-card', viewType);

        const membershipLevels = {
            1: 'Member',
            2: 'Silver',
            3: 'Gold'
        };

        if (viewType === 'grid') {
            memberCard.innerHTML = `
                <img src="images/${member.image}" alt="${member.name} logo" loading="lazy">
                <h3>${member.name}</h3>
                <p class="description">${member.description}</p>
                <p><strong>Address:</strong> ${member.address}</p>
                <p><strong>Phone:</strong> <a href="tel:${member.phone}">${member.phone}</a></p>
                <p><strong>Website:</strong> <a href="${member.website}" target="_blank">Visit Site</a></p>
                <span class="membership-level level-${member.membershipLevel}">
                    ${membershipLevels[member.membershipLevel]}
                </span>
            `;
        } else {
            memberCard.innerHTML = `
                <div class="member-info">
                    <h3>${member.name}</h3>
                    <p><strong>Address:</strong> ${member.address}</p>
                    <p><strong>Phone:</strong> <a href="tel:${member.phone}">${member.phone}</a></p>
                    <p><strong>Website:</strong> <a href="${member.website}" target="_blank">Visit Site</a></p>
                    <span class="membership-level level-${member.membershipLevel}">
                        ${membershipLevels[member.membershipLevel]}
                    </span>
                </div>
            `;
        }

        directoryContainer.appendChild(memberCard);
    });
}

async function loadWeatherData() {
    try {
        const currentResponse = await fetch(CURRENT_WEATHER_URL);
        if (currentResponse.ok) {
            const currentData = await currentResponse.json();
            displayCurrentWeather(currentData);
        }

        const forecastResponse = await fetch(FORECAST_URL);
        if (forecastResponse.ok) {
            const forecastData = await forecastResponse.json();
            displayForecast(forecastData);
        }
    } catch (error) {
        console.error('Weather data loading error:', error);
        displayWeatherError();
    }
}

function displayCurrentWeather(data) {
    const tempElement = document.getElementById('current-temp');
    const iconElement = document.getElementById('weather-icon');
    const descElement = document.getElementById('weather-desc');
    const highTempElement = document.getElementById('high-temp');
    const lowTempElement = document.getElementById('low-temp');
    const humidityElement = document.getElementById('humidity');
    const sunriseElement = document.getElementById('sunrise');
    const sunsetElement = document.getElementById('sunset');

    if (tempElement && iconElement && descElement) {
        tempElement.textContent = `${Math.round(data.main.temp)}°C`;

        const iconCode = data.weather[0].icon;
        iconElement.src = `https://openweathermap.org/img/w/${iconCode}.png`;
        iconElement.alt = data.weather[0].description;

        descElement.textContent = data.weather[0].description;
    }

    if (highTempElement) {
        highTempElement.textContent = `${Math.round(data.main.temp_max)}°`;
    }

    if (lowTempElement) {
        lowTempElement.textContent = `${Math.round(data.main.temp_min)}°`;
    }

    if (humidityElement) {
        humidityElement.textContent = `${data.main.humidity}%`;
    }

    if (sunriseElement && data.sys.sunrise) {
        const sunrise = new Date(data.sys.sunrise * 1000);
        sunriseElement.textContent = sunrise.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }

    if (sunsetElement && data.sys.sunset) {
        const sunset = new Date(data.sys.sunset * 1000);
        sunsetElement.textContent = sunset.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }

    const locationName = `${data.name}, ${data.sys.country}`;
    updateWeatherTips(Math.round(data.main.temp), data.main.humidity, locationName);
}

function displayForecast(data) {
    const forecasts = data.list.filter((item, index) => index % 8 === 0).slice(0, 3);

    forecasts.forEach((forecast, index) => {
        const tempElement = document.getElementById(`temp-day${index + 1}`);
        const dayElement = document.getElementById(`day-name${index + 1}`);

        if (tempElement) {
            tempElement.textContent = `${Math.round(forecast.main.temp)}°C`;
        }

        if (dayElement) {
            const forecastDate = new Date(forecast.dt * 1000);
            const dayName = forecastDate.toLocaleDateString('en-US', { weekday: 'long' });

            if (index === 0) {
                dayElement.textContent = 'Today';
            } else if (index === 1) {
                dayElement.textContent = 'Tomorrow';
            } else {
                dayElement.textContent = dayName;
            }
        }
    });
}

function displayWeatherError() {
    const tempElement = document.getElementById('current-temp');
    const descElement = document.getElementById('weather-desc');

    if (tempElement) tempElement.textContent = 'N/A';
    if (descElement) descElement.textContent = 'Weather data unavailable';
}

async function loadMemberSpotlights() {
    try {
        const response = await fetch('data/members.json');
        if (response.ok) {
            const data = await response.json();
            displaySpotlights(data);
        }
    } catch (error) {
        console.error('Member data loading error:', error);
    }
}

function displaySpotlights(members) {
    const qualifiedMembers = members.filter(member =>
        member.membershipLevel === 2 || member.membershipLevel === 3
    );

    const numberOfSpotlights = 3;
    const selectedMembers = getRandomMembers(qualifiedMembers, numberOfSpotlights);

    const container = document.getElementById('spotlights-container');
    if (!container) return;

    container.innerHTML = '';

    console.log(`Qualified members: ${qualifiedMembers.length}`);
    console.log(`Selected members: ${selectedMembers.length}`);

    selectedMembers.forEach(member => {
        const spotlightCard = createSpotlightCard(member);
        container.appendChild(spotlightCard);
    });
}

function getRandomMembers(members, count) {
    const shuffled = [...members].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function createSpotlightCard(member) {
    const card = document.createElement('div');
    card.className = 'spotlight-card';

    const membershipLevels = {
        1: 'Member',
        2: 'Silver',
        3: 'Gold'
    };

    card.innerHTML = `
        <img src="images/${member.image}" alt="${member.name} logo" loading="lazy">
        <h4>${member.name}</h4>
        <div class="membership-level level-${member.membershipLevel}">${membershipLevels[member.membershipLevel]} Member</div>
        <div class="contact-info">
            <p><strong>Phone:</strong> ${member.phone}</p>
            <p><strong>Address:</strong> ${member.address}</p>
            <p><a href="${member.website}" target="_blank">Visit Website</a></p>
        </div>
    `;

    return card;
}

function setCurrentYear() {
    const yearElement = document.getElementById('currentyear');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.textContent = currentYear;
    }
}

function setLastModified() {
    const modifiedElement = document.getElementById('lastModified');
    if (modifiedElement) {
        const lastModified = new Date(document.lastModified);
        modifiedElement.textContent = lastModified.toLocaleString();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing...');

    initializeNavigation();

    if (document.querySelector('.hero')) {
        console.log('Home page detected, loading weather and spotlights...');
        loadWeatherData();
        loadMemberSpotlights();
    }

    if (directoryContainer) {
        console.log('Directory page detected, loading members...');
        getMembers();
    }

    setCurrentYear();
    setLastModified();
});

function updateWeatherTips(currentTemp, humidity, locationName) {
    const bestTimeElement = document.getElementById('best-time');
    const tempTrendElement = document.getElementById('temp-trend');
    const locationElement = document.getElementById('weather-location');

    if (!bestTimeElement || !tempTrendElement || !locationElement) return;
    let bestTime = 'Morning (8-10 AM)';
    if (currentTemp > 25) {
        bestTime = 'Early morning or evening';
    } else if (currentTemp < 10) {
        bestTime = 'Midday (12-2 PM)';
    }

    let tempTrend = 'Mild and comfortable';
    if (currentTemp > 25) {
        tempTrend = 'Warm weather ahead';
    } else if (currentTemp < 10) {
        tempTrend = 'Cool conditions';
    }

    bestTimeElement.textContent = bestTime;
    tempTrendElement.textContent = tempTrend;
    locationElement.textContent = locationName;
}