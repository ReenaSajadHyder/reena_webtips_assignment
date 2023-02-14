import changeToFahrenheit from "./export.js";

(function () {
  let weather_data;
  let far;
  let city;
  const monthArr = [
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
  let weatherNow;
  let cityValues;
  let cities;
  let continentOrder = 0;
  let temperatureOrder = 0;

  fetch("data.json")
    .then((data) => data.json())
    .then((result) => {
      weather_data = result;
      setCity();
      initCity();
      categorizeCities("sunny");
     
    });

  function setCity() {
    city = Object.keys(weather_data);
    let cityOption = document.querySelector("#city");
    let option = ``;
    for (let i = 0; i < city.length; i++) {
      option += `<option>${city[i]}</option>`;
    }
    cityOption.innerHTML = option;
  }

  function initCity() {
    let defaultCity = document.querySelector("#city1");
    defaultCity.value = city[8];
    callChange();
    defaultCity.addEventListener("change", callChange);
  }

  function callChange() {
    city = Object.keys(weather_data);
    let cityGiven = document.querySelector("#city1").value;
    let flag = 0;
    for (let i = 0; i < city.length; i++) {
      if (cityGiven == city[i]) {
        changeWeather();
        flag = 1;
      }
    }
    if (flag == 0) {
      setNullVal();
    }
  }
  setInterval(changeWeather, 1000);

  function changeWeather() {
    let curCity = document.querySelector("#city1");
    let currentCity = curCity.value;
    let logo = document.getElementById("city-icon");
    let tempC = document.getElementById("tempnum-c");
    let tempF = document.getElementById("tempnum-f");
    let humNum = document.getElementById("hum-num");
    let precipNum = document.getElementById("precip-number");
    let tZone = weather_data[currentCity].timeZone;
    let time = new Date().toLocaleString("en-US", {
      timeZone: tZone,
      timeStyle: "medium",
      hourCycle: "h12",
    });
    let realTime = document.getElementById("time");
    let date = document.getElementById("date");

    const sixHoursTemp = [
      parseInt(weather_data[currentCity].temperature.slice(0, -2)),
    ];
    for (let i = 1; i < 5; i++) {
      sixHoursTemp[i] = parseInt(weather_data[currentCity].nextFiveHrs[i - 1]);
    }
    sixHoursTemp[5] = parseInt(weather_data[currentCity].temperature);

    //city icon
    logo.src = `./images/Icons for cities/${currentCity}.svg`;

    //Black outline for input box
    curCity.style.borderColor = "black";

    //temperature C
    tempC.innerHTML = weather_data[currentCity].temperature;

    //temperature F
    let cel = weather_data[currentCity].temperature.slice(0, -2);
    far = changeToFahrenheit(cel);
    far = far.toPrecision(3);
    far += ` F`;
    tempF.innerHTML = far;

    //Humidity
    humNum.innerHTML = weather_data[currentCity].humidity;

    //Precipitation
    precipNum.innerHTML = weather_data[currentCity].precipitation;

    //Date and Time
    const dateTimeArr = weather_data[currentCity].dateAndTime.split(",");

    //Real Time
    realTime.innerHTML = time;

    //Date
    let dateSplit = dateTimeArr[0];
    let dateArr = dateSplit.split("/");
    let dateInWords =
      String(dateArr[1].padStart(2, "0")) +
      "-" +
      monthArr[dateArr[0] - 1] +
      "-" +
      dateArr[2];

    date.innerHTML = dateInWords;

    //Hourly Weather
    //Time
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

    //Weather symbol
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

    //Temperature
    document.getElementById("temp-num1").innerHTML = weather_data[
      currentCity
    ].temperature.slice(0, -2);
    for (let i = 2; i < 6; i++) {
      document.getElementById(`temp-num${i}`).innerHTML = weather_data[
        currentCity
      ].nextFiveHrs[i - 2].slice(0, -2);
    }
    document.getElementById("temp-num6").innerHTML = weather_data[
      currentCity
    ].temperature.slice(0, -2);
  }

  function setNullVal() {
    let curCity = document.querySelector("#city1");
    let logo = document.getElementById("city-icon");
    let tempC = document.getElementById("tempnum-c");
    let tempF = document.getElementById("tempnum-f");
    let humNum = document.getElementById("hum-num");
    let precipNum = document.getElementById("precip-number");
    let realTime = document.getElementById("time");
    let date = document.getElementById("date");

    //Red outline for input box
    curCity.style.borderColor = "red";

    //city logo
    logo.src = `./images/Icons for cities/defaultIcon.png`;

    //temperature C
    tempC.innerHTML = "-";

    //temperature F
    tempF.innerHTML = "-";

    //Humidity
    humNum.innerHTML = "-";

    //Precipitation
    precipNum.innerHTML = "-";

    //Date and Time
    realTime.innerHTML = "Invalid City name.";
    date.innerHTML = "";

    //Hourly Weather
    //Time
    for (let i = 1; i < 6; i++) {
      document.getElementById(`hour${i}`).innerHTML = "NA";
    }

    //Weather symbol
    for (let i = 0; i < 6; i++) {
      document.getElementById(`icon-${i + 1}`).src =
        "./images/Weather Icons/warning2.png";
    }

    //Temperature
    for (let i = 1; i < 7; i++) {
      document.getElementById(`temp-num${i}`).innerHTML = "-";
    }
  }

  //Middle Section

  //Function to display cards
  function displayCards(slicedArr) {
    let weatherCard = " ";
    let cardContent = document.querySelector("#row");
    for (let i = 0; i < slicedArr.length; i++) {
      let tZone = cities[i].timeZone;
      let time = new Date().toLocaleString("en-US", {
        timeZone: tZone,
        timeStyle: "medium",
        hourCycle: "h12",
      });

      const dateTimeArr = slicedArr[i].dateAndTime.split(",");
      let dateSplit = dateTimeArr[0];
      let dateArr = dateSplit.split("/");
      let dateInWords =
        String(dateArr[1].padStart(2, "0")) +
        "-" +
        monthArr[dateArr[0] - 1] +
        "-" +
        dateArr[2];

      weatherCard += `<div class="card" id="card-${i}">
        <div class="city-name-temp">
          <p><strong> ${slicedArr[i]["cityName"]}</strong></p>
          <p>
            <img
              class="sunny-icon"
              src="./images/Weather Icons/${weatherNow}Icon.svg"
              alt="sunnyicon"
            />
            <strong>${slicedArr[i]["temperature"]}</strong>
          </p>
        </div>
        <div class="td">
          <p><strong>${time}</strong></p>
        </div>
        <div class="td">
          <p><strong>${dateInWords}</strong></p>
        </div>
        <div class="hp">
          <p>
            <img
              src="./images/Weather Icons/humidityIcon.svg"
              alt="humidity icon"
            />
            ${slicedArr[i]["humidity"]}
          </p>
        </div>
        <div class="hp">
          <p>
            <img
              src="./images/Weather Icons/precipitationIcon.svg"
              alt="precipitation icon"
            />
            ${slicedArr[i]["precipitation"]}
          </p>
        </div>
      </div>`;
    }

    cardContent.innerHTML = weatherCard;

    for (let i = 0; i < slicedArr.length; i++) {
      document.querySelector(
        `#card-${[i]}`
      ).style.backgroundImage = `url('./images/Icons for cities/${slicedArr[
        i
      ].cityName.toLowerCase()}.svg ')`;
    }
  }
  //Function to display the given number of cities
  function displayQuantity() {
    let quant = document.querySelector("#quantity");
    let quantityLimit = quant.value;
    let slicedArr = [];
    let leftScroll = document.querySelector(".scroll-left");
    let rightScroll = document.querySelector(".scroll-right");
    let cardAlignment = document.querySelector("#row");
    if (cities.length > quantityLimit) {
      slicedArr = cities.slice(0, quantityLimit);
    } else {
      slicedArr = cities;
    }
    if (slicedArr.length <= 4) {
      leftScroll.style.visibility = "hidden";
      rightScroll.style.visibility = "hidden";
    } else {
      leftScroll.style.visibility = "";
      rightScroll.style.visibility = "";
    }

    if (slicedArr.length > 4) {
      cardAlignment.style.justifyContent = "flex-start";
    } else {
      cardAlignment.style.justifyContent = "center";
    }
    displayCards(slicedArr);
  }

  //Function to sort cities
  function sortCities() {
    if (weatherNow == "sunny") {
      cities.sort((a, b) => {
        return parseInt(b.temperature) - parseInt(a.temperature);
      });
    } else if (weatherNow == "snowflake") {
      cities.sort((a, b) => {
        return parseInt(b.precipitation) - parseInt(a.precipitation);
      });
    } else {
      cities.sort((a, b) => {
        return parseInt(b.humidity) - parseInt(a.humidity);
      });
    }
    displayQuantity();
  }

  //Function to categorize cities based on weather
  function categorizeCities(weatherGiven) {
    weatherNow = weatherGiven;
    cityValues = Object.values(weather_data);
    cities = [];
    let sunSymbol = document.querySelector("#sun-symbol");
    let coldSymbol = document.querySelector("#cold-symbol");
    let rainSymbol = document.querySelector("#rain-symbol");
    sunSymbol.classList.remove("active");
    coldSymbol.classList.remove("active");
    rainSymbol.classList.remove("active");
    if (weatherNow == "sunny") {
      sunSymbol.classList.add("active");
      for (let i = 0; i < cityValues.length; i++) {
        if (
          parseInt(cityValues[i].temperature) > 29 &&
          parseInt(cityValues[i].humidity) < 50 &&
          parseInt(cityValues[i].precipitation) >= 50
        ) {
          cities.push(cityValues[i]);
        }
      }
    } else if (weatherNow == "snowflake") {
      coldSymbol.classList.add("active");
      for (let i = 0; i < cityValues.length; i++) {
        if (
          parseInt(cityValues[i].temperature) > 20 &&
          parseInt(cityValues[i].temperature) < 28 &&
          parseInt(cityValues[i].humidity) > 50 &&
          parseInt(cityValues[i].precipitation) < 50
        ) {
          cities.push(cityValues[i]);
        }
      }
    } else if (weatherNow == "rainy") {
      rainSymbol.classList.add("active");
      for (let i = 0; i < cityValues.length; i++) {
        if (
          parseInt(cityValues[i].temperature) < 20 &&
          parseInt(cityValues[i].humidity) >= 50
        ) {
          cities.push(cityValues[i]);
        }
      }
    }
    sortCities();
  }

  document.querySelector("#sun-symbol").addEventListener("click", () => {
    categorizeCities("sunny");
  });
  document.querySelector("#cold-symbol").addEventListener("click", () => {
    categorizeCities("snowflake");
  });
  document.querySelector("#rain-symbol").addEventListener("click", () => {
    categorizeCities("rainy");
  });
  document.querySelector("#quantity").addEventListener("click", () => {
    displayQuantity();
  });
  document.querySelector(".scroll-left").addEventListener("click", () => {
    document.querySelector(".row").scrollLeft -= 300;
  });
  document.querySelector(".scroll-right").addEventListener("click", () => {
    document.querySelector(".row").scrollLeft += 300;
  });

  //Bottom section
  //Function to display the continent cards
  function displayContinents() {
    let continentCards = "";
    for(let i = 0; i < 12; i++){
      let curTime = new Date().toLocaleString("en-US", {
        timeZone: cityValues[i].timeZone,
        timeStyle: "medium",
        hourCycle: "h12",
      });
      let timeArr = curTime.split(" ");
      let amPm = timeArr[1];
      let hourMinSec = timeArr[0].split(":");
      let time = "," + hourMinSec[0] + ":" + hourMinSec[1] + " " + amPm;
      
      continentCards += 
      `<div class="box">
      <div class="cont-name">${cityValues[i].timeZone.split("/")[0]} </div>
      <div class="cont-temp">${cityValues[i].temperature}</div>
      <div class="city-time">
      <div>${cityValues[i].cityName}</div>
      <div>${time}</div>
      </div>
      <div class="cont-hum">
      ${cityValues[i].humidity}
      <img src="./images/Weather Icons/humidityIcon.svg" alt="Humidity Icon"></div>
      </div>`
    }
    document.querySelector(".continent-city").innerHTML = continentCards;
  }

  //Function to sort continents by alphabetical order
  function sortContinents(){
    console.log("Inside sortContinents");
    cityValues = Object.values(weather_data);
    if(continentOrder == 0){
      if(temperatureOrder == 0){
        {    
          cityValues.sort((a, b) => 
          {    
            console.log(a.timeZone.split("/")[0]);    
            if (a.timeZone.split("/")[0] === b.timeZone.split("/")[0]) 
            {     
              return parseInt(a.temperature) < parseInt(b.temperature) ? -1 : 1;    
            } 
            else 
            {     
              return a.timeZone.split("/")[0] < b.timeZone.split("/")[0] ? -1 : 1;    
            }    
          });   
        }   
      }
      else
      {
        cityValues.sort((a, b) => 
       {    
        console.log(a.timeZone.split("/")[0]);    
        if (a.timeZone.split("/")[0] === b.timeZone.split("/")[0]) 
        {     
          return parseInt(b.temperature) < parseInt(a.temperature) ? -1 : 1;    
        } 
        else 
        {     
          return a.timeZone.split("/")[0] < b.timeZone.split("/")[0] ? -1 : 1;    
        }    
       });  
      }
    }
    else 
    {
      if(temperatureOrder == 0){
        {    
          cityValues.sort((a, b) => 
          {    
            console.log(a.timeZone.split("/")[0]);    
            if (a.timeZone.split("/")[0] === b.timeZone.split("/")[0]) 
            {     
              return parseInt(a.temperature) < parseInt(b.temperature) ? -1 : 1;    
            } 
            else 
            {     
              return b.timeZone.split("/")[0] < a.timeZone.split("/")[0] ? -1 : 1;    
            }    
          });   
        }   
      }
      else
      {
        cityValues.sort((a, b) => 
       {    
        console.log(a.timeZone.split("/")[0]);    
        if (a.timeZone.split("/")[0] === b.timeZone.split("/")[0]) 
        {     
          return parseInt(b.temperature) < parseInt(a.temperature) ? -1 : 1;    
        } 
        else 
        {     
          return b.timeZone.split("/")[0] < a.timeZone.split("/")[0] ? -1 : 1;    
        }    
       });  
      }
    }
    displayContinents();
  }

  //Eventlisteners to call sortContinents function on clicking the continent sort and temperature sort buttons
  document.querySelector("#continent-name").addEventListener("click", function(){
    if(continentOrder == 0){
      continentOrder = 1;
      document.querySelector(".cont-arrow").src = "./images/General Images & Icons/arrowUp.svg";
    }
    else if(continentOrder==1){
      continentOrder = 0;
      document.querySelector(".cont-arrow").src = "./images/General Images & Icons/arrowDown.svg";
    }
    sortContinents();
  });

  document.querySelector(".temperature").addEventListener("click", () => {
    if(temperatureOrder == 0){
      temperatureOrder = 1;
      document.querySelector(".temp-arrow").src = "./images/General Images & Icons/arrowUp.svg";
    }
    else{
      temperatureOrder = 0;
      document.querySelector(".temp-arrow").src = "./images/General Images & Icons/arrowDown.svg"
    }
    sortContinents();
  });
  
  setInterval(sortContinents, 60000);

})();
