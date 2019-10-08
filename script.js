const countryList = [];
const cityList = [];
const citiesVisited = [];

Fetcher("land.json")
    .then(function (countries) {
        countryList.push(...countries);
        renderMenuItems(countries);
    });

// Hämtar städer efter countryId
Fetcher("stad.json")
    .then(function (cities) {
        cityList.push(...cities);
    });

// Skapa menyn
function renderMenuItems(countries) {
    // Hämtar ul elementet (menyn)
    const menu = document.querySelector("#menu");

    countries.map(function (country) {
        const li = document.createElement("li");

        // Skapar en knapp
        const a = document.createElement("a");
        a.value = country.id;
        a.innerHTML = country.countryname;

        // Här skapar jag ett click event. 
        a.addEventListener("click", function (event) {
            var countryId = event.target.value; // Detta är landets ID

            var citiesBasedOnCountry = cityList.filter(function (city) {
                return city.countryid == countryId;
            })
            renderCities(citiesBasedOnCountry);
        });

        // Lägger till knappen i menuitem (li)
        li.appendChild(a);

        // Lägger till menuItem (li) i menyn (3 st i detta fall);
        menu.appendChild(li);
    });

    const li = document.createElement("li");
    // Skapar en knapp
    const a = document.createElement("a");
    a.innerHTML = "Städer jag besökt";

    a.addEventListener("click", function (event) {
        const citiesPage = document.querySelector("#citiesPage");
        const visitedPage = document.querySelector("#visitedPage");
        citiesPage.style.display = "none";
        visitedPage.style.display = "block";

        const clearHistoryButton = document.querySelector("#clearHistory");

        const temp = localStorage.getItem("citiesVisited");
        if (temp === null) {
            clearHistoryButton.style.display = "none";
            var population = document.getElementById('population');
            population.textContent = "Inga besökta städer.";
        } else {
            clearHistoryButton.style.display = "block";
            clearHistoryButton.addEventListener("click", function () {
                localStorage.removeItem("citiesVisited");
                var population = document.getElementById('population');
                population.textContent = "Historiken rensad.";
                event.target.style.display = "block";
            });
            sumPopulation();
        }
    });

    li.appendChild(a);

    menu.appendChild(li);
}

function renderCities(citiesBasedOnCountry) {
    const citylist = document.querySelector("#citylist");
    citylist.innerHTML = "";

    citiesBasedOnCountry.map(function (city) {
        const li = document.createElement("li");

        // Skapar en knapp
        const button = document.createElement("button");
        button.value = city.population;
        button.innerHTML = city.stadname;

        button.addEventListener("click", function (event) {
            console.log(city);
            const cityInformation = document.querySelector("#cityInformation");
            cityInformation.innerHTML = "";
            const population = document.createElement("div");

            population.innerHTML = "Invånarantal: " + event.target.value;

            const visitedButton = document.createElement("button");
            visitedButton.value = event.target.value;
            visitedButton.innerHTML = "Besök";

            visitedButton.addEventListener("click", function () {
                citiesVisited.push(city.id);
                const temp = localStorage.getItem("citiesVisited");
                let cityExist = false;

                if (temp !== null) {
                    printArray = temp.split(',');
                    cityExist = printArray.find(x => !!(x === city.id.toString()));
                }

                if (!cityExist) {
                    localStorage.setItem("citiesVisited", citiesVisited);
                }
            });

            cityInformation.appendChild(population);
            cityInformation.appendChild(visitedButton);
        });

        li.appendChild(button);
        citylist.appendChild(li);

        const citiesPage = document.querySelector("#citiesPage");
        const visitedPage = document.querySelector("#visitedPage");
        citiesPage.style.display = "block";
        visitedPage.style.display = "none";
    });
}

// sum the population based on visisted cities
function sumPopulation() {
    const temp = localStorage.getItem("citiesVisited");

    if (temp !== null) {
        const printArray = temp.split(",");
        let sumPop = 0;

        for (let i = 0; i < printArray.length; i++) {
            for (let j = 0; j < cityList.length; j++) {
                if (cityList[j].id.toString() == printArray[i]) {
                    sumPop += parseInt(cityList[j].population)
                } else {
                    console.log("Inga matchningar");
                }
            }

        }
        var population = document.getElementById('population');
        population.textContent = sumPop + " st";
    }
}

function Fetcher(url) {
    return fetch(url)
        .then(checkStatus)
        .then(response => response.json())
        .catch(error => console.log("Problems with your fetch operation", error))
}

function checkStatus(response) {
    if (response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}
