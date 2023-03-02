const express = require("express");
const {
  allTimeZones,
  timeForOneCity,
  nextNhoursWeather,
} = require("./timeZone");
const app = express();
const Port = 5000;

app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.render("/public/index.html");
});

app.get("/allCities", (req, res) => {
  weatherResult = allTimeZones();
  res.json(weatherResult);
});

app.get("/cityData", (req, res) => {
  var city = req.query.city;
  if (city) {
    res.json(timeForOneCity(city));
  } else {
    res
      .status(404)
      .json({ Error: "Not a valid endpoint. Please check API Doc" });
  }
});

app.post("/nextFiveHours", (req, res) => {
  let cityDTN = req.body.city_Date_Time_Name;
  let hours = req.body.hours;
  if (cityDTN && hours) {
    res.json(nextNhoursWeather(cityDTN, hours, weatherResult));
  } else {
    res
      .status(404)
      .json({ Error: "Not a valid endpoint. Please check API Doc" });
  }
});

app.listen(Port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(
      "Server connected at port number 5000 with url http://localhost:5000/"
    );
  }
});
