const {
    timeForOneCity,
  } = require("./timeZone");

  process.on("message", (message) => {
    const jsonResponse = timeForOneCity(message.city);
    process.send(jsonResponse);
  });
  