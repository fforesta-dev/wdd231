const gridViewBtn = document.getElementById('grid-view');
const listViewBtn = document.getElementById('list-view');
const directoryContainer = document.getElementById('directory-container');
const menuToggle = document.getElementById('menu-toggle');
const navigation = document.getElementById('navigation');

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

let membersData = [];

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
    getMembers();
    setCurrentYear();
    setLastModified();
});
