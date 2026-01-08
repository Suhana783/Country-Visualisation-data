const body = document.body;

// --- 1. Dynamic Styles ---
const style = document.createElement("style");
style.innerHTML = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; text-align: center; background: #f0f0f0; }
    .navbar { background: #e5e0e0; padding: 2em; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
    .navbar h1 { color: orange; font-size: 3em; letter-spacing: 2px; }
    #searchInput { width: 50%; padding: 0.8em; border-radius: 2em; border: 1px solid #ccc; margin-top: 1.5rem; font-size: 1rem; outline: none; }
    .button-group { margin-top: 1.5em; display: flex; justify-content: center; align-items: center; gap: 10px; }
    button { background-color: #f2882b; border: none; padding: 10px 25px; color: white; font-weight: bold; border-radius: 2em; cursor: pointer; transition: 0.3s; }
    button:hover { background-color: #f9a53e; transform: translateY(-2px); }
    i#graph-icon { font-size: 2.5em; color: #f2882b; cursor: pointer; margin-left: 15px; vertical-align: middle; }
    #result-msg { color: #f2882b; font-weight: bold; margin-top: 10px; min-height: 1.2em; }
    #countries-container { display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; padding: 2em; }
    .country-card { background: white; width: 18em; padding: 1.5em; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.05); }
    .country-card img { width: 100%; height: 120px; object-fit: cover; border-radius: 4px; border: 1px solid #eee; }
    #chart-wrapper { background-color: #fefae0; padding: 3em 10%; margin-top: 2em; }
    canvas { background: white; border: 1px solid #ddd; }
`;
document.head.appendChild(style);

// --- 2. Build UI Structure ---
const navDiv = document.createElement("div");
navDiv.className = "navbar";
navDiv.innerHTML = `
    <h1>World Countries Data</h1>
    <p id="total-countries">Currently, we have ${countries.length} Countries</p>
    <input type="text" id="searchInput" placeholder="Search by name, capital or language">
    <div id="result-msg"></div>
    <div class="button-group">
        <button id="btn-name">NAME</button>
        <button id="btn-capital">CAPITAL</button>
        <button id="btn-population">POPULATION</button>
        <i id="graph-icon" class="fa-solid fa-chart-simple"></i>
    </div>
`;
body.appendChild(navDiv);

const countriesContainer = document.createElement("div");
countriesContainer.id = "countries-container";
body.appendChild(countriesContainer);

const chartWrapper = document.createElement("div");
chartWrapper.id = "chart-wrapper";
chartWrapper.innerHTML = `<canvas id="myChart"></canvas>`;
body.appendChild(chartWrapper);

// --- 3. Functional Logic ---
const inputField = document.getElementById("searchInput");
const resultMsg = document.getElementById("result-msg");
let chartInstance = null;

function displayCountries(data) {
    countriesContainer.innerHTML = "";
    data.forEach(country => {
        const card = document.createElement("div");
        card.className = "country-card";
        card.innerHTML = `
            <img src="${country.flag}" alt="${country.name} flag">
            <h3 style="margin: 10px 0; color: #f2882b;">${country.name.toUpperCase()}</h3>
            <p><strong>Capital:</strong> ${country.capital || 'N/A'}</p>
            <p><strong>Languages:</strong> ${country.languages.join(", ")}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        `;
        countriesContainer.appendChild(card);
    });
}

function renderChart(data) {
    if (chartInstance) chartInstance.destroy();

    // Get top 10 from the current selection
    const topData = [...data]
        .sort((a, b) => b.population - a.population)
        .slice(0, 10);

    const ctx = document.getElementById("myChart").getContext("2d");
    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topData.map(c => c.name),
            datasets: [{
                label: 'Population',
                data: topData.map(c => c.population),
                backgroundColor: '#f2882b'
            }]
        },
        options: { responsive: true }
    });
}

// Global Filter Helper
function getFilteredData() {
    const query = inputField.value.toLowerCase();
    return countries.filter(c => 
        c.name.toLowerCase().includes(query) || 
        (c.capital && c.capital.toLowerCase().includes(query)) ||
        c.languages.some(lang => lang.toLowerCase().includes(query))
    );
}

// --- 4. Event Listeners ---
inputField.addEventListener("input", () => {
    const filtered = getFilteredData();
    resultMsg.textContent = inputField.value ? `${filtered.length} countries matches found` : "";
    displayCountries(filtered);
    renderChart(filtered);
});

document.getElementById("btn-name").addEventListener("click", () => {
    const sorted = getFilteredData().sort((a, b) => a.name.localeCompare(b.name));
    displayCountries(sorted);
});

document.getElementById("btn-capital").addEventListener("click", () => {
    const sorted = getFilteredData().sort((a, b) => (a.capital || "").localeCompare(b.capital || ""));
    displayCountries(sorted);
});

document.getElementById("btn-population").addEventListener("click", () => {
    const sorted = getFilteredData().sort((a, b) => b.population - a.population);
    displayCountries(sorted);
});

document.getElementById("graph-icon").addEventListener("click", () => {
    document.getElementById("chart-wrapper").scrollIntoView({ behavior: "smooth" });
});

// Initial Load
displayCountries(countries);
renderChart(countries);