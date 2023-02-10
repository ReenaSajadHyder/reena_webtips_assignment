import changeToFahrenheit from "./export.js";

(function () {
  var weather_data;
  let far;
  var city;

  fetch("data.json")
    .then((data) => data.json())
    .then((result) => {
      weather_data = result;
      setCity();
      initCity();
    });

  function setCity() {
    city = Object.keys(weather_data);
    var cityOption = document.querySelector("#city");
    var option = ``;
    for (let i = 0; i < city.length; i++) {
      option += `<option>${city[i]}</option>`;
    }
    cityOption.innerHTML = option;
  }

  function initCity() {
    var defaultCity = document.querySelector("#city1");
    defaultCity.value = city[8];
    callChange();
    defaultCity.addEventListener("change", callChange);
  }

  function callChange() {
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

    var curCity = document.querySelector("#city1");
    var currentCity = curCity.value;
    var logo = document.getElementById("city-icon");
    var tempC = document.getElementById("tempnum-c");
    var tempF = document.getElementById("tempnum-f");
    var humNum = document.getElementById("hum-num");
    var precipNum = document.getElementById("precip-number");
    var tZone = weather_data[currentCity].timeZone;
    var time = new Date().toLocaleString("en-US", {
      timeZone: tZone,
      timeStyle: "medium",
      hourCycle: "h12",
    });
    var realTime = document.getElementById("time");
    var date = document.getElementById("date");


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
    for (var i = 1; i < 6; i++) {
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
    var curCity = document.querySelector("#city1");
    var logo = document.getElementById("city-icon");
    var tempC = document.getElementById("tempnum-c");
    var tempF = document.getElementById("tempnum-f");
    var humNum = document.getElementById("hum-num");
    var precipNum = document.getElementById("precip-number");
    var realTime = document.getElementById("time");
    var date = document.getElementById("date");

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
})();
