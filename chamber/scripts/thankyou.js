

function displayFormData() {
    const urlParams = new URLSearchParams(window.location.search);
    const formDataContainer = document.getElementById('form-data');

    console.log('Form data container found:', formDataContainer);
    console.log('URL search params:', window.location.search);
    console.log('URL params object:', urlParams);

    if (!formDataContainer) {
        console.error('Form data container not found!');
        return;
    }

    const formData = {
        'first-name': 'First name',
        'last-name': 'Last name',
        'email': 'Email',
        'phone': 'Cell phone number',
        'business-name': 'Organization',
        'membership-level': 'Membership level',
        'timestamp': 'Application submitted'
    };

    let html = '';

    for (const [param, label] of Object.entries(formData)) {
        const value = urlParams.get(param);
        if (value) {
            let displayValue = value;

            if (param === 'membership-level') {
                const levels = {
                    'np': 'Non Profit Membership Level',
                    'bronze': 'Bronze Membership Level',
                    'silver': 'Silver Membership Level',
                    'gold': 'Gold Membership Level'
                };
                displayValue = levels[value] || value;
            }

            if (param === 'timestamp') {
                const date = new Date(value);
                displayValue = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }

            html += `
                <div class="form-data-item">
                    <span class="form-data-label">${label}:</span>
                    <span class="form-data-value">${displayValue}</span>
                </div>
            `;
        }
    }

    console.log('Generated HTML:', html);

    if (html === '') {
        html = '<p>No form data found. Please return to the <a href="join.html">join page</a> and submit the form.</p>';
        console.log('No form data found in URL parameters');
    }

    console.log('Setting innerHTML to:', html);
    formDataContainer.innerHTML = html;
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
    displayFormData();
    setCurrentYear();
    setLastModified();
});