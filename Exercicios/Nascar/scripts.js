// Update existing loadEsportsTitles to use the new tbody ID
function loadEsportsTitles() {
    const tbody = document.getElementById('esports-titles-tbody');
    if (!tbody) return;

    const savedTitles = localStorage.getItem('esports_titles_data');
    let titlesData = savedTitles ? JSON.parse(savedTitles) : getDefaultEsportsTitlesData();

    tbody.innerHTML = '';
    titlesData.forEach((title, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${title.category}</td>
            <td>${title.year}</td>
            <td>${title.driver}</td>
            <td>${title.event}</td>
            <td>
                <button onclick="editEsportsTitle(${index})">Edit</button>
                <button onclick="deleteEsportsTitle(${index})">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// New function to load driver titles
function loadDriverTitles() {
    const container = document.getElementById('driver-titles-container');
    if (!container) return;

    const savedDriverTitles = localStorage.getItem('esports_driver_titles_data');
    let driverTitlesData = savedDriverTitles ? JSON.parse(savedDriverTitles) : getDefaultDriverTitlesData();

    // Group titles by driver
    const drivers = [...new Set(driverTitlesData.map(item => item.driver))];
    container.innerHTML = '';

    drivers.forEach(driver => {
        const driverCard = document.createElement('div');
        driverCard.className = 'driver-title-card';
        driverCard.innerHTML = `
            <h3 onclick="toggleDriverTitles(this)">${driver}</h3>
            <table class="driver-titles-table" style="display: none;">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Year</th>
                        <th>Event</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        `;
        const tbody = driverCard.querySelector('tbody');
        const driverTitles = driverTitlesData.filter(item => item.driver === driver);
        driverTitles.forEach((title, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${title.category}</td>
                <td>${title.year}</td>
                <td>${title.event}</td>
                <td>
                    <button onclick="editDriverTitle('${driver}', ${index})">Edit</button>
                    <button onclick="deleteDriverTitle('${driver}', ${index})">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        container.appendChild(driverCard);
    });
}

// New function to toggle driver titles visibility
function toggleDriverTitles(header) {
    const table = header.nextElementSibling;
    table.style.display = table.style.display === 'none' ? 'table' : 'none';
}

// Default data for driver titles
function getDefaultDriverTitlesData() {
    return [
        { driver: 'Steven Wilson', category: 'eNASCAR Coca-Cola iRacing Series', year: 2024, event: 'eNASCAR Championship at Homestead' },
        { driver: 'Michael Conti', category: 'eNASCAR Coca-Cola iRacing Series', year: 2023, event: 'eNASCAR Championship at Phoenix' },
        { driver: 'Zane Smith', category: 'eNASCAR Heat Pro League', year: 2022, event: 'eNASCAR Heat Finals at Daytona' },
        { driver: 'Keegan Leahy', category: 'eNASCAR Coca-Cola iRacing Series', year: 2021, event: 'eNASCAR Championship at Texas' },
        { driver: 'Wyatt Tinsley', category: 'eNASCAR Ignite Series', year: 2024, event: 'eNASCAR Ignite Finals at Charlotte' }
    ];
}

// New function to add driver title
function addDriverTitle() {
    const driver = document.getElementById('driver-title-driver').value;
    const category = document.getElementById('driver-title-category').value;
    const year = document.getElementById('driver-title-year').value;
    const event = document.getElementById('driver-title-event').value;

    if (!driver || !category || !year || !event) {
        alert('Please fill in all fields.');
        return;
    }

    const savedDriverTitles = JSON.parse(localStorage.getItem('esports_driver_titles_data')) || getDefaultDriverTitlesData();
    savedDriverTitles.unshift({ driver, category, year, event });
    localStorage.setItem('esports_driver_titles_data', JSON.stringify(savedDriverTitles));
    loadDriverTitles();
    clearDriverTitleForm();
}

// New function to clear driver title form
function clearDriverTitleForm() {
    document.getElementById('driver-title-driver').value = '';
    document.getElementById('driver-title-category').value = '';
    document.getElementById('driver-title-year').value = '';
    document.getElementById('driver-title-event').value = '';
}

// New function to edit driver title
function editDriverTitle(driver, index) {
    const savedDriverTitles = JSON.parse(localStorage.getItem('esports_driver_titles_data')) || getDefaultDriverTitlesData();
    const driverTitles = savedDriverTitles.filter(item => item.driver === driver);
    const title = driverTitles[index];

    const newCategory = prompt('Edit Category:', title.category);
    const newYear = prompt('Edit Year:', title.year);
    const newEvent = prompt('Edit Event:', title.event);

    if (newCategory && newYear && newEvent) {
        const globalIndex = savedDriverTitles.findIndex(item => item.driver === driver && item.category === title.category && item.year === title.year && item.event === title.event);
        savedDriverTitles[globalIndex] = { driver, category: newCategory, year: newYear, event: newEvent };
        localStorage.setItem('esports_driver_titles_data', JSON.stringify(savedDriverTitles));
        loadDriverTitles();
        alert('Driver Title updated successfully!');
    } else {
        alert('All fields are required.');
    }
}

// New function to delete driver title
function deleteDriverTitle(driver, index) {
    if (confirm('Are you sure you want to delete this driver title?')) {
        const savedDriverTitles = JSON.parse(localStorage.getItem('esports_driver_titles_data')) || getDefaultDriverTitlesData();
        const driverTitles = savedDriverTitles.filter(item => item.driver === driver);
        const title = driverTitles[index];
        const globalIndex = savedDriverTitles.findIndex(item => item.driver === driver && item.category === title.category && item.year === title.year && item.event === title.event);
        savedDriverTitles.splice(globalIndex, 1);
        localStorage.setItem('esports_driver_titles_data', JSON.stringify(savedDriverTitles));
        loadDriverTitles();
        alert('Driver Title deleted successfully!');
    }
}

// Update initialization logic
if (document.getElementById('news-container')) {
    loadNews();
    loadStandings();
    loadNextEvent();
}

if (document.getElementById('schedule-table')) {
    loadSchedule();
}

if (document.getElementById('standings-table') && window.location.pathname.includes('standings.html')) {
    loadStandings();
}

if (document.getElementById('drivers-container')) {
    loadDrivers();
}

if (document.getElementById('tracks-container')) {
    loadTracks();
}

if (document.getElementById('titles-tbody') && window.location.pathname.includes('titles.html')) {
    loadTitles();
}

if (window.location.pathname.includes('titles-esports.html')) {
    loadEsportsTitles();
    loadDriverTitles();
}

if (window.location.pathname.includes('news-detail.html')) {
    loadNewsDetail();
}

if (window.location.pathname.includes('driver-detail.html')) {
    loadDriverDetail();
}

if (window.location.pathname.includes('event-detail.html')) {
    loadEventDetail();
}

if (document.getElementById('admin-news-list')) {
    loadAdminNews();
}

if (document.getElementById('driver-image')) {
    document.getElementById('driver-image').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) document.querySelector('.driver-image-label').textContent = file.name;
    });
}