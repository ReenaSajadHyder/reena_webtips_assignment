const {
    allTimeZones,
  } = require("./timeZone");

  process.on("message", (message) => {
    const jsonResponse = allTimeZones();
    process.send(jsonResponse);
  });
  