const airport = require("../db/data/airports.json");
const routes = require("../db/data/routes.json");
const fs = require("fs");

let startAirports = [];
for (let i of routes) {
  if (i.STOPS === 0) {
    if (!startAirports.includes(i.START_AIRPORT)) {
      startAirports.push(i.START_AIRPORT);
    }
  }
}

const airports = airport.airports;
let airportsWithDetail = [];
for (let item of airports) {
  if (item.iata) {
    if (startAirports.includes(item.fs)) {
      airportsWithDetail.push({
        fs: item.fs,
        airportName: `${item.name}(${item.fs}), ${item.city}, ${item.countryName}.`,
      });
    }
  }
}

// fs: item.fs,
// name: item.name,
// countryCode: item.countryCode,
// countryName: item.countryName,
// city: item.city,

fs.appendFile(
  "airportsWithDetail.json",
  JSON.stringify(airportFullNames, null, 2),
  "utf8",
  (err) => {
    if (err) throw err;
    console.log("The data was appended to file!");
  }
);
