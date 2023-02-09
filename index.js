import changeToFahrenheit from "./export.js";

var weather_data;
let far;

(function () {
  fetch("data.json")
    .then((data) => data.json())
    .then((result) => {
      weather_data = result;
      setCity();
      initCity();
    });

  function setCity() {
    var city = Object.keys(weather_data);
    var inputdata = document.getElementById("city").value;
    var option = ``;
    for (let i = 0; i < city.length; i++) {
      option += `<option>${city[i]}</option>`;
    }
    document.querySelector("#city").innerHTML = option;
  }

  function initCity() {
    var city = Object.keys(weather_data);
    document.querySelector("#city1").value = city[0];
    callChange();
    document.querySelector("#city1").addEventListener("change", callChange);
  }

  function callChange() {
    var city = Object.keys(weather_data);
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

    var city = Object.keys(weather_data);
    var curCity = document.querySelector("#city1");
    var currentCity = document.querySelector("#city1").value;

    const sixHoursTemp = [
      parseInt(weather_data[currentCity].temperature.slice(0, -2)),
    ];
    for (let i = 1; i < 5; i++) {
      sixHoursTemp[i] = parseInt(weather_data[currentCity].nextFiveHrs[i - 1]);
    }
    sixHoursTemp[5] = parseInt(weather_data[currentCity].temperature);

    //city icon
    var logo = document.getElementById("city-icon");
    logo.src = `./images/Icons for cities/${currentCity}.svg`;

    //Black outline for input box
    curCity.style.borderColor = "black";

    //temperature C
    document.getElementById("tempnum-c").innerHTML =
      weather_data[currentCity].temperature;

    //temperature F
    let cel = weather_data[currentCity].temperature.slice(0, -2);
    far = changeToFahrenheit(cel);
    far = far.toPrecision(3);
    far += ` F`;
    document.getElementById("tempnum-f").innerHTML = far;

    //Humidity
    document.getElementById("hum-num").innerHTML =
      weather_data[currentCity].humidity;

    //Precipitation
    document.getElementById("precip-number").innerHTML =
      weather_data[currentCity].precipitation;

    //Date and Time
    const dateTimeArr = weather_data[currentCity].dateAndTime.split(",");

    //Real Time
    var tZone = weather_data[currentCity].timeZone;
    var time = new Date().toLocaleString("en-US", {
      timeZone: tZone,
      timeStyle: "medium",
      hourCycle: "h12",
    });
    document.getElementById("time").innerHTML = time;

    //Date
    let dateSplit = dateTimeArr[0];
    let dateArr = dateSplit.split("/");
    let dateInWords =
      String(dateArr[1].padStart(2, "0")) +
      "-" +
      monthArr[dateArr[0] - 1] +
      "-" +
      dateArr[2];
    document.getElementById("date").innerHTML = dateInWords;

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

    //Red outline for input box
    curCity.style.borderColor = "red";

    //city logo
    var logo = document.getElementById("city-icon");
    logo.src = `./images/Icons for cities/defaultIcon.png`;

    //temperature C
    document.getElementById("tempnum-c").innerHTML = "-";

    //temperature F
    document.getElementById("tempnum-f").innerHTML = "-";

    //Humidity
    document.getElementById("hum-num").innerHTML = "-";

    //Precipitation
    document.getElementById("precip-number").innerHTML = "-";

    //Date and Time
    document.getElementById("time").innerHTML = "Invalid City name.";
    document.getElementById("date").innerHTML = "";

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
