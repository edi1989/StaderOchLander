//Är localstorage med städer "null", om inte skapa localstorage, om "null", skapa inte localstorage.
// 3/10******************************************************************************

var ListVisitedCities = []; //Array för besökta länder
var controllCity = JSON.parse(localStorage.getItem("cityId"));
var listAllCities;


// if (controllCity !== null) {
//     for (i = 0; i < controllCity.length; i++) {
//         ListVisitedCities.push(controllCity[i]);
//     }
// }


//Hämta data i land.json
fetch("land.json")
    .then(function (response) {
        return response.json();
    })
    .then(function (countries) {
        printCountries(countries);
    });



function printCountries(countries) {
    var menu = document.getElementById("menu");

    for (var i = 0; i < countries.length; i++) {
        var listitem = document.createElement("li");
        var menuButton = document.createElement("button");

        menuButton.innerHTML = countries[i].countryname;
        menuButton.value = countries[i].id;
        menuButton.onclick = function (event) { printCities(event.target.value) }

        listitem.appendChild(menuButton);
        menu.appendChild(listitem);
    }

    //3/10 Skriv ut städer jag besökt (Knapp)******************************************************************************
    var listitem = document.createElement("li");
    var visitedCitiesButton = document.createElement("button");

    visitedCitiesButton.innerHTML = ("Städer jag besökt")

    menu.appendChild(visitedCitiesButton);

    visitedCitiesButton.onclick = function (event) {
        var visitedArray = localStorage.getItem("visitedCities");
        var printArray = JSON.parse(visitedArray);

        showVisitedCities(printArray);
        sumPopulation();
    }

    var listitem = document.createElement("li");
    var clearButton = document.createElement("button");
    clearButton.innerHTML = ("Rensa localstorage");
    menu.appendChild(clearButton);
    clearButton.onclick = function () {
        localStorage.clear();
        location.reload();
    }

}

//for loop för att skapa lista på städer jag besökt från min array i localstorage

//}
//Visa besökta städer
function showVisitedCities(printArray) {
    var showVisitedCities = document.getElementById("showVisitedCities");
    showVisitedCities.innerHTML = "";
    for (i = 0; i < printArray.length; i++) {
        showVisitedCities.insertAdjacentHTML("beforeend", "<button>" + printArray[i] + "</button>");

    }
}
//Hämta data i stad.json
function printCities(countryId) {
    fetch("stad.json")
        .then(function (response) {
            return response.json();
        })
        .then(function (cities) {
            listAllCities = cities;
            var citiesBasedOnCountry = cities.filter(function (city) {
                return city.countryid == countryId;
            })

            var citylist = document.getElementById("citylist");
            citylist.innerHTML = "";

            for (i = 0; i < citiesBasedOnCountry.length; i++) {
                var listitem = document.createElement("li");
                var listButton = document.createElement("button");
                listButton.innerHTML = citiesBasedOnCountry[i].stadname;
                listButton.value = citiesBasedOnCountry[i].population;
                listButton.id = citiesBasedOnCountry[i].stadname;

                //Kolla om staden redan är besökt, om inte visa knapp, annars visa texten redan besökt (IF ska börja någonstans vid rad 45?)

                listButton.onclick = function (event) { displayCityInformation(event) } //Ska ingå i IF som ELSE
                citylist.appendChild(listButton);
            }
        })
}

// Visa informationsvy om staden (KONTROLLERA VARFÖR INTE INFORMATIONSVYN)

function displayCityInformation(event) {

    cityid = event.target.id;
    let temp = localStorage.getItem("visitedCities");

    if (temp !== null) {

        printArray = JSON.parse(temp);
        console.log(temp);
        for (var i = 0; i < printArray.length; i++) {
            if (cityid !== printArray[i]) {
                ListVisitedCities.push(cityid)
                console.log(cityid);

            } else {
                alert("Redan besökt!!")
            }
            ListVisitedCities.push(cityid);
        }
        console.log(cityid);
    }
}
var myJson = JSON.stringify(ListVisitedCities);
localStorage.setItem("visitedCities", myJson);



var div = document.createElement('div');

var paragraph = document.createElement('p');
paragraph.innerHTML = event.target.value;

var cityButton = document.createElement('button');
cityButton.innerHTML = "Besök";

cityButton.onclick = function (event) {
    div.appendChild(paragraph);
    div.appendChild(cityButton);
    event.target.appendChild(div);


    // //Lägg till den besökta stadens cityid i localstorage
    // ListVisitedCities.push(cityid)

    // console.log("click   " + cityid);
    // div.innerHTML = "Tack för ditt besök";
}





// sum the population based on visisted cities
function sumPopulation() {

    let temp = localStorage.getItem("visitedCities"),
        printArray = JSON.parse(temp),
        sumPop = 0;

    Fetcher("stad.json")
        .then(data => {
            for (let i = 0; i < printArray.length; i++) {
                for (let j = 0; j < data.length; j++) {
                    if (data[j].stadname == printArray[i]) {
                        sumPop += parseInt(data[j].population)
                    } else {
                        console.log("Inga matchningar");
                    }

                }

            }
            var population = document.getElementById('population');
            population.textContent = sumPop + " st"
        })
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