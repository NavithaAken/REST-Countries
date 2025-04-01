let countriesArrayList = [];
let index = 0;

function loadCountries(searchQuery = null) {
    let fetchUrl = "/countries.json";
    if (searchQuery) {
        fetchUrl = `https://restcountries.com/v3.1/name/${searchQuery}`;
    }

    fetch(fetchUrl)
        .then(res => res.json())
        .then(dataList => {
            if (!Array.isArray(dataList)) {
                dataList = [dataList];
            }
            countriesArrayList = dataList;
            let countriesList = document.getElementById("countriesTable");
            countriesList.innerHTML = "";
            
            dataList.forEach((element, index) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td><img src="${element.flags.svg}" width="50" alt="Flag of ${element.name.common}"></td>
                    <td>${element.name.common}</td>
                    <td>${element.population.toLocaleString()}</td>
                    <td>${element.region}</td>
                    <td><button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="loadModalData(${index})">More</button></td>
                `;
                countriesList.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Error fetching country data:", error);
            document.getElementById("countriesTable").innerHTML = "<tr><td colspan='6'>Country not found.</td></tr>";
        });
}

async function loadModalData(index) {
    let modalBody = document.getElementById("modal-body");
    let country = countriesArrayList[index];
    let currencies = country.currencies
        ? Object.values(country.currencies).map(curr => `${curr.name} (${curr.symbol})`).join(", ")
        : "N/A";
    let languages = country.languages
        ? Object.values(country.languages).join(", ")
        : "N/A";

    modalBody.innerHTML = `
        <div class="card" style="width: 100%;">
            <div class="card-body text-center">
                <img src="${country.flags.png}" alt="Flag of ${country.name.common}" width="250px"><br>
                <h5 class="card-title">${country.name.official}</h5>
                <h6 class="card-subtitle mb-2 text-body-secondary">${country.name.common}</h6>

                <p><strong>Capital:</strong> ${country.capital ? country.capital.join(", ") : "N/A"}</p>
                <p><strong>Start Day of the Week:</strong> ${country.startOfWeek}</p>
                <p><strong>Independent:</strong> ${country.independent ? "Yes" : "No"}</p>
                <p><strong>Region:</strong> ${country.region}</p>
                <p><strong>Subregion:</strong> ${country.subregion}</p>
                <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                <p><strong>Currency:</strong> ${currencies}</p>
                <p><strong>Languages:</strong> ${languages}</p>
                <p><strong>Timezones:</strong> ${country.timezones.join(", ")}</p>
            </div>
        </div>
    `;
}


function search(event) {
    event.preventDefault();
    let searchTxt = document.getElementById("txtSearch").value;
    loadCountries(searchTxt);
}

document.querySelector("form").addEventListener("submit", search);

loadCountries(); 