import { attractions } from '../data/attractions.mjs';

const menuToggle = document.getElementById('menu-toggle');
const navigation = document.getElementById('navigation');
const galleryContainer = document.getElementById('gallery-container');
const visitorMessage = document.getElementById('visitor-message');

function initializeNavigation() {
    if (menuToggle && navigation) {
        menuToggle.addEventListener('click', toggleMenu);
    }
}

function toggleMenu() {
    navigation.classList.toggle('show');
    menuToggle.classList.toggle('active');
}

function displayVisitorMessage() {
    const now = Date.now();
    const lastVisit = localStorage.getItem('lastVisit');
    let message = '';

    if (!lastVisit) {
        message = 'Welcome! Let us know if you have any questions.';
    } else {
        const timeDiff = now - parseInt(lastVisit);
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        if (daysDiff < 1) {
            message = 'Back so soon! Awesome!';
        } else if (daysDiff === 1) {
            message = 'You last visited 1 day ago.';
        } else {
            message = `You last visited ${daysDiff} days ago.`;
        }
    }

    if (visitorMessage) {
        visitorMessage.innerHTML = `
            <div class="message-content">
                <p>${message}</p>
                <button class="close-message" onclick="this.parentElement.parentElement.style.display='none'">×</button>
            </div>
        `;
        visitorMessage.style.display = 'block';
    }

    localStorage.setItem('lastVisit', now.toString());
}

function createAttractionCard(attraction) {
    return `
        <article class="attraction-card" style="grid-area: card${attraction.id}">
            <h2>${attraction.name}</h2>
            <figure>
                <img src="${attraction.image}" 
                     alt="${attraction.imageAlt}" 
                     width="300" 
                     height="200"
                     loading="lazy">
            </figure>
            <address>${attraction.address}</address>
            <p>${attraction.description}</p>
            <button class="learn-more-btn" onclick="alert('More information about ${attraction.name} coming soon!')">Learn More</button>
        </article>
    `;
}

function displayAttractions() {
    if (galleryContainer) {
        const cardsHTML = attractions.map(createAttractionCard).join('');
        galleryContainer.innerHTML = cardsHTML;
    }
}

function setCurrentYear() {
    const currentYear = document.getElementById('currentyear');
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
}

function setLastModified() {
    const lastModified = document.getElementById('lastModified');
    if (lastModified) {
        lastModified.textContent = document.lastModified;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    displayVisitorMessage();
    displayAttractions();
    setCurrentYear();
    setLastModified();
});