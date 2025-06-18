// Get all necessary elements
const container = document.getElementById("countries-container");
const searchInput = document.getElementById("search");
const resultMsg = document.getElementById("result-msg");

const nameBtn = document.getElementById("sort-name");
const capitalBtn = document.getElementById("sort-capital");
const populationBtn = document.getElementById("sort-population");

// Function to display countries
function displayCountries(countriesList) {
  container.innerHTML = "";

  if (countriesList.length === 0) {
    container.innerHTML = "<p>No matching countries found.</p>";
    return;
  }

  countriesList.forEach(country => {
    const div = document.createElement("div");
    div.className = "country-card";
    div.innerHTML = `
      <img src="${country.flag}" alt="${country.name} flag" />
      <h3>${country.name.toUpperCase()}</h3>
      <p><strong>Capital:</strong> ${country.capital}</p>
      <p><strong>Languages:</strong> ${country.languages.join(", ")}</p>
      <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
    `;
    container.appendChild(div);
  });
}

// Initial display
displayCountries(countries);

// Show all countries again when input is cleared
searchInput.addEventListener("input", () => {
  const value = searchInput.value.trim();
  if (value === "") {
    displayCountries(countries);
    resultMsg.textContent = "";
  }
});

// Filter by NAME
nameBtn.addEventListener("click", () => {
  const keyword = searchInput.value.trim().toLowerCase();
  const filtered = countries.filter(country =>
    country.name.toLowerCase().includes(keyword)
  );
  displayCountries(filtered);
  resultMsg.textContent = `${filtered.length} countries matched by name`;
});

// Filter by CAPITAL
capitalBtn.addEventListener("click", () => {
  const keyword = searchInput.value.trim().toLowerCase();
  const filtered = countries.filter(country =>
    country.capital && country.capital.toLowerCase().includes(keyword)
  );
  displayCountries(filtered);
  resultMsg.textContent = `${filtered.length} countries matched by capital`;
});

// Filter by POPULATION
populationBtn.addEventListener("click", () => {
  const keyword = Number(searchInput.value.trim());

  if (isNaN(keyword) || keyword <= 0) {
    resultMsg.textContent = `⚠️ Enter a valid number to filter by population`;
    displayCountries([]);
    return;
  }

  const filtered = countries.filter(country =>
    typeof country.population === "number" && country.population >= keyword
  );

  displayCountries(filtered);
  resultMsg.textContent = `${filtered.length} countries with population ≥ ${keyword.toLocaleString()}`;
});








  
