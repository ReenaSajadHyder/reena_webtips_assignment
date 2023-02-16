import changeToFahrenheit from "./export.js";

fetch("data.json")
  .then((data) => data.json())
  .then((result) => {
    // setCity();
    // initCity();
    // categorizeCities("sunny");
    let obj = new Base(result);
    obj.setCity();
    obj.initCity();
  });

function Base(data) {
  this.data = data;
  this.far = 0;
  this.city = [];
  this.monthArr = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  this.weatherNow = "";
  this.cityValues = [];
  this.cities = [];
  this.continentOrder = 0;
  this.temperatureOrder = 0;
  this.inputCity = document.querySelector("#city1");
  this.cityLogo = document.getElementById("city-icon");
  this.tempC = document.getElementById("tempnum-c");
  this.tempF = document.getElementById("tempnum-f");
  this.humNum = document.getElementById("hum-num");
  this.precipNum = document.getElementById("precip-number");
  this.realTime = document.getElementById("time");
  this.date = document.getElementById("date");
  this.sunSymbol = document.querySelector("#sun-symbol");
  this.coldSymbol = document.querySelector("#cold-symbol");
  this.rainSymbol = document.querySelector("#rain-symbol");
  this.quant = document.querySelector("#quantity");
  this.leftScroll = document.querySelector(".scroll-left");
  this.rightScroll = document.querySelector(".scroll-right");
  this.cardContent = document.querySelector("#row");

  this.inputCity.addEventListener("input", this.callChange.bind(this));

  console.log(this.data);
}

//funtion to display all the available city options
Base.prototype.setCity = function () {
  this.city = Object.keys(this.data);
  let cityOption = document.querySelector("#city");
  let option = ``;
  for (let i = 0; i < this.city.length; i++) {
    option += `<option>${this.city[i]}</option>`;
  }
  cityOption.innerHTML = option;
};

//function to display the results for vienna initially
Base.prototype.initCity = function () {
  this.inputCity.value = this.city[8];
  this.callChange();
};

//function to display the weather results based on user's choice
Base.prototype.callChange = function () {
  this.city = Object.keys(this.data);
  let cityGiven = this.inputCity.value.toLowerCase();

  let flag = 0;
  for (let i = 0; i < this.city.length; i++) {
    if (cityGiven === this.city[i]) {
      this.changeWeather();
      flag = 1;
    }
  }
  if (flag == 0) {
    this.setNullVal();
  }
};

//setInterval(changeWeather, 1000);

//function to display weather results for the given city
Base.prototype.changeWeather = function () {
  let currentCity = this.inputCity.value.toLowerCase();
  let tZone = this.data[currentCity].timeZone;
  let time = new Date().toLocaleString("en-US", {
    timeZone: tZone,
    timeStyle: "medium",
    hourCycle: "h12",
  });

  const sixHoursTemp = [
    parseInt(this.data[currentCity].temperature.slice(0, -2)),
  ];
  for (let i = 1; i < 5; i++) {
    sixHoursTemp[i] = parseInt(this.data[currentCity].nextFiveHrs[i - 1]);
  }
  sixHoursTemp[5] = parseInt(this.data[currentCity].temperature);

  this.cityLogo.src = `./images/Icons for cities/${currentCity}.svg`;

  this.inputCity.style.borderColor = "black";

  this.tempC.innerHTML = this.data[currentCity].temperature;

  let cel = this.data[currentCity].temperature.slice(0, -2);
  this.far = changeToFahrenheit(cel);
  this.far = this.far.toPrecision(3);
  this.far += ` F`;
  this.tempF.innerHTML = this.far;

  this.humNum.innerHTML = this.data[currentCity].humidity;

  this.precipNum.innerHTML = this.data[currentCity].precipitation;

  let dateTimeArr = this.data[currentCity].dateAndTime.split(",");

  this.realTime.innerHTML = time;

  let dateSplit = dateTimeArr[0];
  let dateArr = dateSplit.split("/");
  let dateInWords =
    String(dateArr[1].padStart(2, "0")) +
    "-" +
    this.monthArr[dateArr[0] - 1] +
    "-" +
    dateArr[2];

  this.date.innerHTML = dateInWords;

  let amPm = time.slice(-2);
  time = time.slice(0, 2);
  time = parseInt(time) + 1;
  function timeChange() {
    time = time - 12;
  }
  function amPmChange() {
    if (time == 12 && amPm == "AM") {
      amPm = "PM";
    } else if (time == 12 && amPm == "PM") {
      amPm = "AM";
    } else if (time > 12) {
      timeChange();
    }
  }
  for (let i = 1; i < 6; i++) {
    amPmChange();
    document.getElementById(`hour${i}`).innerHTML = time + amPm;
    time++;
  }

  for (let i = 0; i < 6; i++) {
    if (sixHoursTemp[i] < 0) {
      document.getElementById(`icon-${i + 1}`).src =
        "./images/Weather Icons/snowflakeIcon.svg";
    } else if (sixHoursTemp[i] < 18) {
      document.getElementById(`icon-${i + 1}`).src =
        "./images/Weather Icons/rainyIcon.svg";
    } else if (sixHoursTemp[i] >= 18 && sixHoursTemp[i] <= 22) {
      document.getElementById(`icon-${i + 1}`).src =
        "./images/Weather Icons/windyIcon.svg";
    } else if (sixHoursTemp[i] >= 23 && sixHoursTemp[i] <= 29) {
      document.getElementById(`icon-${i + 1}`).src =
        "./images/Weather Icons/cloudyIcon.svg";
    } else if (sixHoursTemp[i] > 29) {
      document.getElementById(`icon-${i + 1}`).src =
        "./images/Weather Icons/sunnyIcon.svg";
    }
  }

  document.getElementById("temp-num1").innerHTML = this.data[
    currentCity
  ].temperature.slice(0, -2);
  for (let i = 2; i < 6; i++) {
    document.getElementById(`temp-num${i}`).innerHTML = this.data[
      currentCity
    ].nextFiveHrs[i - 2].slice(0, -2);
  }
  document.getElementById("temp-num6").innerHTML = this.data[
    currentCity
  ].temperature.slice(0, -2);
};

//function to display null values if user enters invalid city
Base.prototype.setNullVal = function () {
  this.inputCity.style.borderColor = "red";

  this.cityLogo.src = `./images/Icons for cities/defaultIcon.png`;

  this.tempC.innerHTML = "-";

  this.tempF.innerHTML = "-";

  this.humNum.innerHTML = "-";

  this.precipNum.innerHTML = "-";

  this.realTime.innerHTML = "Invalid City name.";
  this.date.innerHTML = "";

  for (let i = 1; i < 6; i++) {
    document.getElementById(`hour${i}`).innerHTML = "NA";
  }

  for (let i = 0; i < 6; i++) {
    document.getElementById(`icon-${i + 1}`).src =
      "./images/Weather Icons/warning2.png";
  }

  for (let i = 1; i < 7; i++) {
    document.getElementById(`temp-num${i}`).innerHTML = "-";
  }
};

//Middle Section
//Function to display cards
// Base.prototype.displayCards = function() {
//   let weatherCard = " ";
//   for (let i = 0; i < slicedArr.length; i++) {

//     let curTime = new Date().toLocaleString("en-US", {
//       timeZone: cityValues[i].timeZone,
//       timeStyle: "medium",
//       hourCycle: "h12",
//     });

//     let timeArr = curTime.split(" ");
//     let amPm = timeArr[1];
//     let hourMinSec = timeArr[0].split(":");
//     let time = hourMinSec[0] + ":" + hourMinSec[1] + " " + amPm;

//     const dateTimeArr = slicedArr[i].dateAndTime.split(",");
//     let dateSplit = dateTimeArr[0];
//     let dateArr = dateSplit.split("/");
//     let dateInWords =
//       String(dateArr[1].padStart(2, "0")) +
//       "-" +
//       monthArr[dateArr[0] - 1] +
//       "-" +
//       dateArr[2];

//     weatherCard += `<div class="card" id="card-${i}">
//       <div class="city-name-temp">
//         <p><strong> ${slicedArr[i]["cityName"]}</strong></p>
//         <p>
//           <img
//             class="sunny-icon"
//             src="./images/Weather Icons/${weatherNow}Icon.svg"
//             alt="sunnyicon"
//           />
//           <strong>${slicedArr[i]["temperature"]}</strong>
//         </p>
//       </div>
//       <div class="td">
//         <p><strong>${time}</strong></p>
//       </div>
//       <div class="td">
//         <p><strong>${dateInWords}</strong></p>
//       </div>
//       <div class="hp">
//         <p>
//           <img
//             src="./images/Weather Icons/humidityIcon.svg"
//             alt="humidity icon"
//           />
//           ${slicedArr[i]["humidity"]}
//         </p>
//       </div>
//       <div class="hp">
//         <p>
//           <img
//             src="./images/Weather Icons/precipitationIcon.svg"
//             alt="precipitation icon"
//           />
//           ${slicedArr[i]["precipitation"]}
//         </p>
//       </div>
//     </div>`;
// }
//   cardContent.innerHTML = weatherCard;

//   for (let i = 0; i < slicedArr.length; i++) {
//     document.querySelector(
//       `#card-${[i]}`
//     ).style.backgroundImage = `url('./images/Icons for cities/${slicedArr[
//       i
//     ].cityName.toLowerCase()}.svg ')`;
//   }
// }

// //Function to display the given number of cities
// Base.prototype.displayQuantity = function() {
//   let quantityLimit = quant.value;
//   let slicedArr = [];
//   if (cities.length > quantityLimit) {
//     slicedArr = cities.slice(0, quantityLimit);
//   } else {
//     slicedArr = cities;
//   }
//   if (slicedArr.length <= 4) {
//     leftScroll.style.visibility = "hidden";
//     rightScroll.style.visibility = "hidden";
//   } else {
//     leftScroll.style.visibility = "";
//     rightScroll.style.visibility = "";
//   }

//   if (slicedArr.length > 4) {
//     cardContent.style.justifyContent = "flex-start";
//   } else {
//     cardContent.style.justifyContent = "center";
//   }
//   displayCards(slicedArr);
// }

// //Function to sort cities
// Base.prototype.sortCities = function() {
//   if (weatherNow == "sunny") {
//     cities.sort((a, b) => {
//       return parseInt(b.temperature) - parseInt(a.temperature);
//     });
//   } else if (weatherNow == "snowflake") {
//     cities.sort((a, b) => {
//       return parseInt(b.precipitation) - parseInt(a.precipitation);
//     });
//   } else {
//     cities.sort((a, b) => {
//       return parseInt(b.humidity) - parseInt(a.humidity);
//     });
//   }
//   displayQuantity();
// }

// //Function to categorize cities based on weather
// Base.prototype.categorizeCities  = function() {
//   weatherNow = weatherGiven;
//   cityValues = Object.values(weather_data);
//   cities = [];
//   sunSymbol.classList.remove("active");
//   coldSymbol.classList.remove("active");
//   rainSymbol.classList.remove("active");
//   if (weatherNow == "sunny") {
//     sunSymbol.classList.add("active");
//     for (let i = 0; i < cityValues.length; i++) {
//       if (
//         parseInt(cityValues[i].temperature) > 29 &&
//         parseInt(cityValues[i].humidity) < 50 &&
//         parseInt(cityValues[i].precipitation) >= 50
//       ) {
//         cities.push(cityValues[i]);
//       }
//     }
//   } else if (weatherNow == "snowflake") {
//     coldSymbol.classList.add("active");
//     for (let i = 0; i < cityValues.length; i++) {
//       if (
//         parseInt(cityValues[i].temperature) > 20 &&
//         parseInt(cityValues[i].temperature) < 28 &&
//         parseInt(cityValues[i].humidity) > 50 &&
//         parseInt(cityValues[i].precipitation) < 50
//       ) {
//         cities.push(cityValues[i]);
//       }
//     }
//   } else if (weatherNow == "rainy") {
//     rainSymbol.classList.add("active");
//     for (let i = 0; i < cityValues.length; i++) {
//       if (
//         parseInt(cityValues[i].temperature) < 20 &&
//         parseInt(cityValues[i].humidity) >= 50
//       ) {
//         cities.push(cityValues[i]);
//       }
//     }
//   }
//   sortCities();
// }

// sunSymbol.addEventListener("click", () => {
//   categorizeCities("sunny");
// });
// coldSymbol.addEventListener("click", () => {
//   categorizeCities("snowflake");
// });
// rainSymbol.addEventListener("click", () => {
//   categorizeCities("rainy");
// });
// quant.addEventListener("click", () => {
//   displayQuantity();
// });
// leftScroll.addEventListener("click", () => {
//   document.querySelector(".row").scrollLeft -= 300;
// });
// rightScroll.addEventListener("click", () => {
//   document.querySelector(".row").scrollLeft += 300;
// });

// //Bottom section
// //Function to display the continent cards
// function displayContinents() {
//   let continentCards = "";
//   let continentCity = document.querySelector(".continent-city");
//   for (let i = 0; i < 12; i++) {
//     let curTime = new Date().toLocaleString("en-US", {
//       timeZone: cityValues[i].timeZone,
//       timeStyle: "medium",
//       hourCycle: "h12",
//     });
//     let timeArr = curTime.split(" ");
//     let amPm = timeArr[1];
//     let hourMinSec = timeArr[0].split(":");
//     let time = "," + hourMinSec[0] + ":" + hourMinSec[1] + " " + amPm;

//     continentCards += `<div class="box">
//       <div class="cont-name">${cityValues[i].timeZone.split("/")[0]} </div>
//       <div class="cont-temp">${cityValues[i].temperature}</div>
//       <div class="city-time">
//       <div>${cityValues[i].cityName}</div>
//       <div>${time}</div>
//       </div>
//       <div class="cont-hum">
//       ${cityValues[i].humidity}
//       <img src="./images/Weather Icons/humidityIcon.svg" alt="Humidity Icon"></div>
//     </div>`;
//   }
//   continentCity.innerHTML = continentCards;
// }

// //Function to sort continents by alphabetical order
// function sortContinents() {
//   cityValues = Object.values(weather_data);
//   if (continentOrder == 0) {
//     if (temperatureOrder == 0) {
//       {
//         cityValues.sort((a, b) => {
//           if (a.timeZone.split("/")[0] === b.timeZone.split("/")[0]) {
//             return parseInt(a.temperature) < parseInt(b.temperature) ? -1 : 1;
//           } else {
//             return a.timeZone.split("/")[0] < b.timeZone.split("/")[0]
//               ? -1
//               : 1;
//           }
//         });
//       }
//     } else {
//       cityValues.sort((a, b) => {
//         if (a.timeZone.split("/")[0] === b.timeZone.split("/")[0]) {
//           return parseInt(b.temperature) < parseInt(a.temperature) ? -1 : 1;
//         } else {
//           return a.timeZone.split("/")[0] < b.timeZone.split("/")[0] ? -1 : 1;
//         }
//       });
//     }
//   } else {
//     if (temperatureOrder == 0) {
//       {
//         cityValues.sort((a, b) => {
//           if (a.timeZone.split("/")[0] === b.timeZone.split("/")[0]) {
//             return parseInt(a.temperature) < parseInt(b.temperature) ? -1 : 1;
//           } else {
//             return b.timeZone.split("/")[0] < a.timeZone.split("/")[0]
//               ? -1
//               : 1;
//           }
//         });
//       }
//     } else {
//       cityValues.sort((a, b) => {
//         if (a.timeZone.split("/")[0] === b.timeZone.split("/")[0]) {
//           return parseInt(b.temperature) < parseInt(a.temperature) ? -1 : 1;
//         } else {
//           return b.timeZone.split("/")[0] < a.timeZone.split("/")[0] ? -1 : 1;
//         }
//       });
//     }
//   }
//   displayContinents();
// }

// //Eventlisteners to call sortContinents function on clicking the continent sort and temperature sort buttons
// document
//   .querySelector("#continent-name")
//   .addEventListener("click", function () {
//     if (continentOrder == 0) {
//       continentOrder = 1;
//       document.querySelector(".cont-arrow").src =
//         "./images/General Images & Icons/arrowUp.svg";
//     } else if (continentOrder == 1) {
//       continentOrder = 0;
//       document.querySelector(".cont-arrow").src =
//         "./images/General Images & Icons/arrowDown.svg";
//     }
//     sortContinents();
//   });

// document.querySelector(".temperature").addEventListener("click", () => {
//   if (temperatureOrder == 0) {
//     temperatureOrder = 1;
//     document.querySelector(".temp-arrow").src =
//       "./images/General Images & Icons/arrowUp.svg";
//   } else {
//     temperatureOrder = 0;
//     document.querySelector(".temp-arrow").src =
//       "./images/General Images & Icons/arrowDown.svg";
//   }
//   sortContinents();
// });

// setInterval(sortContinents, 60000);
