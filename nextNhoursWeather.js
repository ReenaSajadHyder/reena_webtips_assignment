const {
    nextNhoursWeather,allTimeZones
  } = require("./timeZone");

  process.on("message", (message) => {
    const jsonResponse = nextNhoursWeather(message.cityDTN, message.hours,allTimeZones());
    process.send(jsonResponse);
  });
  