import changeToFahrenheit from "./export.js";

class WeatherApp {
  constructor(data) {
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
  }

  //function to get the time according to the time zone
  getTime(timeZone) {
    let curTime = new Date().toLocaleString("en-US", {
      timeZone: timeZone,
      timeStyle: "short",
      hourCycle: "h12",
    });
    return curTime;
  }
}

//class weatherNow inherits WeatherApp
class WeatherNow extends WeatherApp {
  constructor(data) {
    super(data);
    this.inputCity.addEventListener("input", this.callChange.bind(this));
    this.sunSymbol.addEventListener(
      "click",
      this.categorizeCities.bind(this, "sunny")
    );
    this.coldSymbol.addEventListener(
      "click",
      this.categorizeCities.bind(this, "snowflake")
    );
    this.rainSymbol.addEventListener(
      "click",
      this.categorizeCities.bind(this, "rainy")
    );
    this.quant.addEventListener("click", this.displayQuantity.bind(this));
    this.leftScroll.addEventListener(
      "click",
      this.cardleftScroll.bind(this, 300)
    );
    this.rightScroll.addEventListener(
      "click",
      this.cardrightScroll.bind(this, 300)
    );
    document
      .querySelector("#continent-name")
      .addEventListener("click", this.changeContArrow.bind(this));
    document
      .querySelector(".temperature")
      .addEventListener("click", this.changeTempArrow.bind(this));
  }

  //function to display all the available city options
  setCity() {
    this.city = weatherObject.keys(this.data);
    let cityOption = document.querySelector("#city");
    let option = ``;
    for (let i = 0; i < this.city.length; i++) {
      option += `<option>${this.city[i]}</option>`;
    }
    cityOption.innerHTML = option;
  }

  //function to display the results for vienna initially
  initCity() {
    this.inputCity.value = this.city[8];
    this.callChange();
  }

  //function to display the weather results WeatherAppd on user's choice
  callChange() {
    this.city = weatherObject.keys(this.data);
    let cityGiven = this.inputCity.value;

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
  }

  //function to fetch the details of the city given by the user
  async fetchCityDetails() 
  {
    let currentCity = this.inputCity.value;
    const response = await fetch(
      `https://soliton.glitch.me?city=${currentCity}`
    );
    const data = await response.json();
    const result = await data;
    const response2 = await fetch(
      "https://soliton.glitch.me/hourly-forecast",
      {
        method: "POST",
        body: JSON.stringify({
          ...result,
          hours: "5",
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    );
    const data2 = await response2.json();
    const result2 = await data2;
    for (let i = 0; i < 5; i++) {
      this.setNextFiveHrsTemp(
        this.data[`${currentCity}`].temperature,
        result2
      );
    }
  }

  //function to display weather results for the given city
  changeWeather() {
    let currentCity = this.inputCity.value;
    let tZone = this.data[currentCity].timeZone;
    let time = new Date().toLocaleString("en-US", {
      timeZone: tZone,
      timeStyle: "medium",
      hourCycle: "h12",
    });

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

    this.fetchCityDetails();
  }

  //function to display the temperature and weather symbols for the next five hours
  setNextFiveHrsTemp(currentTemp, hourlyTempweatherObj) {
    let hourlyTemp = [];
    let weatherSymbols = [];

    for (let i = 0; i < 6; i++) {
      weatherSymbols[i] = document.getElementById(`icon-${i + 1}`);
    }

    hourlyTemp[0] = parseInt(currentTemp);

    for (let i = 1; i < 6; i++) {
      hourlyTemp[i] = parseInt(hourlyTempweatherObj["temperature"][i - 1]);
    }

    for (let i = 0; i < 6; i++) {
      document.getElementById(`temp-num${i + 1}`).innerHTML = hourlyTemp[i];
      if (hourlyTemp[i] < 0) {
        document.getElementById(`icon-${i + 1}`).src =
          "./images/Weather Icons/snowflakeIcon.svg";
      } else if (hourlyTemp[i] < 18) {
        document.getElementById(`icon-${i + 1}`).src =
          "./images/Weather Icons/rainyIcon.svg";
      } else if (hourlyTemp[i] >= 18 && hourlyTemp[i] <= 22) {
        document.getElementById(`icon-${i + 1}`).src =
          "./images/Weather Icons/windyIcon.svg";
      } else if (hourlyTemp[i] >= 23 && hourlyTemp[i] <= 29) {
        document.getElementById(`icon-${i + 1}`).src =
          "./images/Weather Icons/cloudyIcon.svg";
      } else if (hourlyTemp[i] > 29) {
        document.getElementById(`icon-${i + 1}`).src =
          "./images/Weather Icons/sunnyIcon.svg";
      }
    }
  }

  //function to display null values if user enters invalid city
  setNullVal() {
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
  }

  //Middle Section
  //Function to display cards
  displayCards(slicedArr) {
    let weatherCard = " ";
    for (let i = 0; i < slicedArr.length; i++) {
      let curTime = this.getTime(slicedArr[i].timeZone);
      const dateTimeArr = slicedArr[i].dateAndTime.split(",");
      let dateSplit = dateTimeArr[0];
      let dateArr = dateSplit.split("/");
      let dateInWords =
        String(dateArr[1].padStart(2, "0")) +
        "-" +
        this.monthArr[dateArr[0] - 1] +
        "-" +
        dateArr[2];

      weatherCard += `<div class="card" id="card-${i}">
      <div class="city-name-temp">
        <p><strong> ${slicedArr[i]["cityName"]}</strong></p>
        <p>
          <img
            class="sunny-icon"
            src="./images/Weather Icons/${this.weatherNow}Icon.svg"
            alt="sunnyicon"
          />
          <strong>${slicedArr[i]["temperature"]}</strong>
        </p>
      </div>
      <div class="td">
        <p><strong>${curTime}</strong></p>
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
    this.cardContent.innerHTML = weatherCard;

    for (let i = 0; i < slicedArr.length; i++) {
      document.querySelector(
        `#card-${[i]}`
      ).style.backgroundImage = `url('./images/Icons for cities/${slicedArr[
        i
      ].cityName.toLowerCase()}.svg ')`;
    }
  }

  //Function to display the given number of cities
  displayQuantity() {
    let quantityLimit = this.quant.value;
    let slicedArr = [];
    if (this.cities.length > quantityLimit) {
      slicedArr = this.cities.slice(0, quantityLimit);
    } else {
      slicedArr = this.cities;
    }
    if (slicedArr.length <= 4) {
      this.leftScroll.style.visibility = "hidden";
      this.rightScroll.style.visibility = "hidden";
    } else {
      this.leftScroll.style.visibility = "";
      this.rightScroll.style.visibility = "";
    }

    if (slicedArr.length > 4) {
      this.cardContent.style.justifyContent = "flex-start";
    } else {
      this.cardContent.style.justifyContent = "center";
    }
    this.displayCards(slicedArr);
  }

  //Function to sort cities
  sortCities() {
    if (this.weatherNow == "sunny") {
      this.cities.sort((a, b) => {
        return parseInt(b.temperature) - parseInt(a.temperature);
      });
    } else if (this.weatherNow == "snowflake") {
      this.cities.sort((a, b) => {
        return parseInt(b.precipitation) - parseInt(a.precipitation);
      });
    } else {
      this.cities.sort((a, b) => {
        return parseInt(b.humidity) - parseInt(a.humidity);
      });
    }
    this.displayQuantity();
  }

  //Function to categorize cities based on weather
  categorizeCities(weatherGiven) {
    this.weatherNow = weatherGiven;
    this.cityValues = weatherObject.values(this.data);
    this.cities = [];
    this.sunSymbol.classList.remove("active");
    this.coldSymbol.classList.remove("active");
    this.rainSymbol.classList.remove("active");
    if (this.weatherNow == "sunny") {
      this.sunSymbol.classList.add("active");
      for (let i = 0; i < this.cityValues.length; i++) {
        if (
          parseInt(this.cityValues[i].temperature) > 29 &&
          parseInt(this.cityValues[i].humidity) < 50 &&
          parseInt(this.cityValues[i].precipitation) >= 50
        ) {
          this.cities.push(this.cityValues[i]);
        }
      }
    } else if (this.weatherNow == "snowflake") {
      this.coldSymbol.classList.add("active");
      for (let i = 0; i < this.cityValues.length; i++) {
        if (
          parseInt(this.cityValues[i].temperature) > 20 &&
          parseInt(this.cityValues[i].temperature) < 28 &&
          parseInt(this.cityValues[i].humidity) > 50 &&
          parseInt(this.cityValues[i].precipitation) < 50
        ) {
          this.cities.push(this.cityValues[i]);
        }
      }
    } else if (this.weatherNow == "rainy") {
      this.rainSymbol.classList.add("active");
      for (let i = 0; i < this.cityValues.length; i++) {
        if (
          parseInt(this.cityValues[i].temperature) < 20 &&
          parseInt(this.cityValues[i].humidity) >= 50
        ) {
          this.cities.push(this.cityValues[i]);
        }
      }
    }
    this.sortCities();
  }

  cardleftScroll(val) {
    document.querySelector(".row").scrollLeft -= val;
  }

  cardrightScroll(val) {
    document.querySelector(".row").scrollLeft += val;
  }

  //Bottom section
  //Function to display the continent cards
  displayContinents() {
    let continentCards = "";
    let continentCity = document.querySelector(".continent-city");
    for (let i = 0; i < 12; i++) {
      let curTime = this.getTime(this.cityValues[i].timeZone);
      let time = ", " + curTime;

      continentCards += `<div class="box">
      <div class="cont-name">${this.cityValues[i].timeZone.split("/")[0]} </div>
      <div class="cont-temp">${this.cityValues[i].temperature}</div>
      <div class="city-time">
      <div>${this.cityValues[i].cityName}</div>
      <div>${time}</div>
      </div>
      <div class="cont-hum">
      ${this.cityValues[i].humidity}
      <img src="./images/Weather Icons/humidityIcon.svg" alt="Humidity Icon"></div>
    </div>`;
    }
    continentCity.innerHTML = continentCards;
  }

  //Function to sort continents by alphabetical order
  sortContinents() {
    this.cityValues = weatherObject.values(this.data);
    if (this.continentOrder == 0) {
      if (this.temperatureOrder == 0) {
        {
          this.cityValues.sort((a, b) => {
            if (a.timeZone.split("/")[0] === b.timeZone.split("/")[0]) {
              return parseInt(a.temperature) < parseInt(b.temperature) ? -1 : 1;
            } else {
              return a.timeZone.split("/")[0] < b.timeZone.split("/")[0]
                ? -1
                : 1;
            }
          });
        }
      } else {
        this.cityValues.sort((a, b) => {
          if (a.timeZone.split("/")[0] === b.timeZone.split("/")[0]) {
            return parseInt(b.temperature) < parseInt(a.temperature) ? -1 : 1;
          } else {
            return a.timeZone.split("/")[0] < b.timeZone.split("/")[0] ? -1 : 1;
          }
        });
      }
    } else {
      if (this.temperatureOrder == 0) {
        {
          this.cityValues.sort((a, b) => {
            if (a.timeZone.split("/")[0] === b.timeZone.split("/")[0]) {
              return parseInt(a.temperature) < parseInt(b.temperature) ? -1 : 1;
            } else {
              return b.timeZone.split("/")[0] < a.timeZone.split("/")[0]
                ? -1
                : 1;
            }
          });
        }
      } else {
        this.cityValues.sort((a, b) => {
          if (a.timeZone.split("/")[0] === b.timeZone.split("/")[0]) {
            return parseInt(b.temperature) < parseInt(a.temperature) ? -1 : 1;
          } else {
            return b.timeZone.split("/")[0] < a.timeZone.split("/")[0] ? -1 : 1;
          }
        });
      }
    }
    this.displayContinents();
  }

  changeContArrow() {
    if (this.continentOrder == 0) {
      this.continentOrder = 1;
      document.querySelector(".cont-arrow").src =
        "./images/General Images & Icons/arrowDown.svg";
    } else if (this.continentOrder == 1) {
      this.continentOrder = 0;
      document.querySelector(".cont-arrow").src =
        "./images/General Images & Icons/arrowUp.svg";
    }
    this.sortContinents();
  }

  changeTempArrow() {
    if (this.temperatureOrder == 0) {
      this.temperatureOrder = 1;
      document.querySelector(".temp-arrow").src =
        "./images/General Images & Icons/arrowDown.svg";
    } else {
      this.temperatureOrder = 0;
      document.querySelector(".temp-arrow").src =
        "./images/General Images & Icons/arrowUp.svg";
    }
    this.sortContinents();
  }
}

(async function () {
  const response = await fetch("https://soliton.glitch.me/all-timezone-cities");
  const data = await response.json();
  const result = await data;
  let listOfCities = {};
  for (let i = 0; i < result.length; i++) {
    listOfCities[result[i]["cityName"]] = result[i];
  }
  let weatherObj = new WeatherNow(listOfCities);
  weatherObj.setCity();
  weatherObj.initCity();
  weatherObj.categorizeCities("sunny");
  weatherObj.sortContinents();
  setInterval(weatherObj.sortContinents.bind(weatherObj), 60000);
})();
