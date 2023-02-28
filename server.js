const express = require("express");
const {fork} = require("child_process");
const path = require("path");
const app = express();
const Port = 5000;

app.use(express.static(path.join(__dirname, "public")))
app.use(express.json())

app.get("/", (req, res) => {
  res.render("/public/index.html");
})

app.get("/allCities", (req, res) => {
  const allCities = fork('./allTimeZones.js');
  allCities.send("message");
  allCities.on("message", message => res.json(message));
})

app.get("/cityData", (req, res) => {
  const cityData = fork('./timeForOneCity.js');
  cityData.send({"city": req.query.city});
  cityData.on("message", message => res.json(message));
});

app.post("/nextFiveHours", (req, res) => {
  const nextFiveHours = fork('./nextNhoursWeather.js');
  nextFiveHours.send({cityDTN: req.body.city_Date_Time_Name, hours: req.body.hours});
  nextFiveHours.on("message", message => res.json(message));
});

app.listen(Port, (err) => {
  if(err){
    console.log(err);
  }
  else{
    console.log("Server connected at port number 5000 with url http://localhost:5000/");
  }
});