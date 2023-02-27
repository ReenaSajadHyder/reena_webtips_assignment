const http = require("http");
const path = require("path");
const fs = require("fs");
const Port = 5000;

const {
  allTimeZones,
  timeForOneCity,
  nextNhoursWeather,
} = require("./timeZone");
let currentCity = "";

var appServer = http.createServer((req, res) => {
  let file = path.join(req.url === "/" ? "index.html" : req.url.slice(1));
  let contentType = "text/html";
  let extension = path.extname(file);
  switch (extension) {
    case ".css":
      contentType = "text/css";
      break;
    case ".js":
      contentType = "text/javascript";
      break;
    case ".png":
      contentType = "image/x-png";
      break;
    case ".svg":
      contentType = "image/svg+xml";
      break;
  }

  if (req.url === ".ico") {
    res.end();
    return;
  } else if (req.url == "/allCities") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify(allTimeZones()));
    res.end();
  } else if (req.url.match("/cityData")) {
    currentCity = req.url.split("=")[1];
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify(timeForOneCity(currentCity)));
    res.end();
  } else if (req.url.match("/nextFiveHours")) {
    let body = " ";
    req.on("data", (data) => (body += data.toString()));
    req.on("end", () => {
      let currentCityDetails = JSON.parse(body);
      res.write(
        JSON.stringify(
          nextNhoursWeather(
            currentCityDetails.city_Date_Time_Name,
            currentCityDetails.hours,
            allTimeZones()
          )
        )
      );
      res.end();
    });
  } else {
    res.writeHead(200, { "Content-Type": contentType });
    fs.createReadStream(file).pipe(res);
  }
});

appServer.listen(Port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Server connected!");
  }
});
