// Weather API functionality
const WEATHER_API_KEY = '92dabf2f8d9c3851bbe133d2b8bcd172'; // Replace with your OpenWeatherMap API key
const TERNI_LAT = 42.57;
const TERNI_LON = 12.67;

// Weather URLs
const CURRENT_WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?lat=42.57&lon=12.67&units=metric&appid=92dabf2f8d9c3851bbe133d2b8bcd172`;
const FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=42.57&lon=12.67&units=metric&appid=92dabf2f8d9c3851bbe133d2b8bcd172`;

// DOM Elements
const gridViewBtn = document.getElementById('grid-view');
const listViewBtn = document.getElementById('list-view');
const directoryContainer = document.getElementById('directory-container');
const menuToggle = document.getElementById('menu-toggle');
const navigation = document.getElementById('navigation');

// Global data storage
let membersData = [];

// Navigation functionality
if (menuToggle && navigation) {
    menuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigation.classList.toggle('open');
        menuToggle.classList.toggle('open');

        menuToggle.offsetHeight;
    });

    menuToggle.addEventListener('touchend', (e) => {
        e.preventDefault();
        navigation.classList.toggle('open');
        menuToggle.classList.toggle('open');

        menuToggle.offsetHeight;
    });
}

// Directory view functionality
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

// Fetch members data
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

// Display members in directory
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

// Weather functionality for home page
async function loadWeatherData() {
    try {
        // Load current weather
        const currentResponse = await fetch(CURRENT_WEATHER_URL);
        if (currentResponse.ok) {
            const currentData = await currentResponse.json();
            displayCurrentWeather(currentData);
        }

        // Load forecast
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

// Display current weather
function displayCurrentWeather(data) {
    const tempElement = document.getElementById('current-temp');
    const iconElement = document.getElementById('weather-icon');
    const descElement = document.getElementById('weather-desc');

    if (tempElement && iconElement && descElement) {
        tempElement.textContent = `${Math.round(data.main.temp)}°C`;

        const iconCode = data.weather[0].icon;
        iconElement.src = `https://openweathermap.org/img/w/${iconCode}.png`;
        iconElement.alt = data.weather[0].description;

        descElement.textContent = data.weather[0].description;
    }
}

// Display 3-day forecast
function displayForecast(data) {
    const forecasts = data.list.filter((item, index) => index % 8 === 0).slice(0, 3);

    forecasts.forEach((forecast, index) => {
        const tempElement = document.getElementById(`temp-day${index + 1}`);
        if (tempElement) {
            tempElement.textContent = `${Math.round(forecast.main.temp)}°C`;
        }
    });
}

// Display weather error
function displayWeatherError() {
    const tempElement = document.getElementById('current-temp');
    const descElement = document.getElementById('weather-desc');

    if (tempElement) tempElement.textContent = 'N/A';
    if (descElement) descElement.textContent = 'Weather data unavailable';
}

// Load member spotlights for home page
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

// Display member spotlights
function displaySpotlights(members) {
    // Filter for gold and silver members only (levels 2 and 3)
    const qualifiedMembers = members.filter(member => 
        member.membershipLevel === 2 || member.membershipLevel === 3
    );
    
    // Always select exactly 3 members
    const numberOfSpotlights = 3;
    const selectedMembers = getRandomMembers(qualifiedMembers, numberOfSpotlights);
    
    const container = document.getElementById('spotlights-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Debug logging
    console.log(`Qualified members: ${qualifiedMembers.length}`);
    console.log(`Selected members: ${selectedMembers.length}`);
    
    selectedMembers.forEach(member => {
        const spotlightCard = createSpotlightCard(member);
        container.appendChild(spotlightCard);
    });
}

// Get random members from array
function getRandomMembers(members, count) {
    const shuffled = [...members].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Create spotlight card element
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

// Utility functions
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

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing...');

    // Check if we're on the home page
    if (document.querySelector('.hero')) {
        console.log('Home page detected, loading weather and spotlights...');
        loadWeatherData();
        loadMemberSpotlights();
    }

    // Check if we're on the directory page
    if (directoryContainer) {
        console.log('Directory page detected, loading members...');
        getMembers();
    }

    // Initialize common functionality
    setCurrentYear();
    setLastModified();
});