// Load Drivers
function loadDrivers() {
    const savedDrivers = localStorage.getItem('supercross_esports_drivers');
    const drivers = savedDrivers ? JSON.parse(savedDrivers) : getDefaultDrivers();
    const select = document.getElementById('title-rider');
    if (!select) return drivers;

    select.innerHTML = '<option value="" disabled selected>Select Driver</option>';
    drivers.forEach(driver => {
        const option = document.createElement('option');
        option.value = driver;
        option.textContent = driver;
        select.appendChild(option);
    });
    return drivers;
}

// Default Drivers
function getDefaultDrivers() {
    return ['CyberRacerX', 'SpeedDemon42', 'TrackMaster99', 'DigitalJett'];
}

// Add New Driver
function addDriver() {
    const driverName = document.getElementById('driver-name').value.trim();
    if (!driverName) {
        alert('Please enter a driver name.');
        return;
    }

    const savedDrivers = localStorage.getItem('supercross_esports_drivers');
    const drivers = savedDrivers ? JSON.parse(savedDrivers) : [];
    if (drivers.includes(driverName)) {
        alert('Driver already exists.');
        return;
    }

    drivers.push(driverName);
    localStorage.setItem('supercross_esports_drivers', JSON.stringify(drivers));
    loadDrivers(); // Refresh dropdown
    document.getElementById('driver-name').value = ''; // Clear form
    alert('Driver added successfully!');
}

// Load eSports Titles (Main Table)
function loadEsportsTitles() {
    const tbody = document.getElementById('esports-titles-tbody');
    if (!tbody) return;

    const savedData = localStorage.getItem('supercross_esports_titles_data');
    const data = savedData ? JSON.parse(savedData) : getDefaultEsportsTitlesData();

    tbody.innerHTML = '';
    data.forEach((row, index) => {
        const tr = document.createElement('tr');
        tr.setAttribute('data-index', index);
        tr.innerHTML = `
            <td contenteditable="true">${row.rider}</td>
            <td contenteditable="true">${row.category}</td>
            <td contenteditable="true">${row.event}</td>
            <td contenteditable="true">${row.year}</td>
        `;
        tbody.appendChild(tr);
    });

    loadDriversTitles(data);
}

// Default eSports Titles Data
function getDefaultEsportsTitlesData() {
    return [
        { rider: 'CyberRacerX', category: '450SX eSports', event: 'Virtual Anaheim 1', year: '2025' },
        { rider: 'CyberRacerX', category: '250SX eSports', event: 'Virtual Daytona', year: '2025' },
        { rider: 'SpeedDemon42', category: '250SX eSports', event: 'eSports SX Finals', year: '2025' },
        { rider: 'TrackMaster99', category: '450SX eSports', event: 'Virtual Salt Lake City', year: '2024' },
        { rider: 'DigitalJett', category: '250SX eSports', event: 'Virtual Indianapolis', year: '2024' }
    ];
}

// Load Drivers and Titles Section
function loadDriversTitles(data) {
    const section = document.getElementById('drivers-titles-section');
    if (!section) return;

    const drivers = {};
    data.forEach((row, index) => {
        if (!drivers[row.rider]) {
            drivers[row.rider] = [];
        }
        drivers[row.rider].push({ ...row, index });
    });

    section.innerHTML = '';
    for (const rider in drivers) {
        const driverBlock = document.createElement('div');
        driverBlock.className = 'driver-block';
        driverBlock.innerHTML = `
            <h3>${rider}</h3>
            <table class="driver-titles-table">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Event</th>
                        <th>Year</th>
                    </tr>
                </thead>
                <tbody>
                    ${drivers[rider].map(title => `
                        <tr data-index="${title.index}">
                            <td contenteditable="true">${title.category}</td>
                            <td contenteditable="true">${title.event}</td>
                            <td contenteditable="true">${title.year}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        section.appendChild(driverBlock);
    }
}

// Add New eSports Title
function addEsportsTitle() {
    const rider = document.getElementById('title-rider').value;
    const category = document.getElementById('title-category').value.trim();
    const event = document.getElementById('title-event').value.trim();
    const year = document.getElementById('title-year').value.trim();

    if (!rider || !category || !event || !year) {
        alert('Please fill in all fields.');
        return;
    }

    const tbody = document.getElementById('esports-titles-tbody');
    const savedData = localStorage.getItem('supercross_esports_titles_data');
    const data = savedData ? JSON.parse(savedData) : [];
    const index = data.length;

    const tr = document.createElement('tr');
    tr.setAttribute('data-index', index);
    tr.innerHTML = `
        <td contenteditable="true">${rider}</td>
        <td contenteditable="true">${category}</td>
        <td contenteditable="true">${event}</td>
        <td contenteditable="true">${year}</td>
    `;
    tbody.appendChild(tr);

    data.push({ rider, category, event, year });
    localStorage.setItem('supercross_esports_titles_data', JSON.stringify(data));
    loadDriversTitles(data);

    document.getElementById('title-rider').value = '';
    document.getElementById('title-category').value = '';
    document.getElementById('title-event').value = '';
    document.getElementById('title-year').value = '';
}

// Save eSports Titles
function saveEsportsTitles() {
    const tbody = document.getElementById('esports-titles-tbody');
    const rows = tbody.querySelectorAll('tr');
    const data = [];

    rows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        data.push({
            rider: cells[0].innerText.trim(),
            category: cells[1].innerText.trim(),
            event: cells[2].innerText.trim(),
            year: cells[3].innerText.trim()
        });
    });

    localStorage.setItem('supercross_esports_titles_data', JSON.stringify(data));
    loadDriversTitles(data);
    loadDrivers(); // Ensure driver list is updated if rider names are edited
    alert('eSports Titles saved successfully!');
}

// Initialize Page
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('esports-titles-tbody')) {
        loadDrivers();
        loadEsportsTitles();
    }
});