const fs = require("fs");
const path = require("path");

const airportData = require("../data/airports.json");
const routes = require("../data/routes.json");
const airlinesData = require("../data/airlines.json");
const flights = require("../data/flights");
const waypointfolder = "../waypoints";

const convertToCSV = (data, headers) => {
  const rows = data.map(row => 
    headers.map(header => {
      let cell = row[header] === null || row[header] === undefined ? "" : row[header];
      if (typeof cell === 'string' && cell.includes(',')) {
        cell = `"${cell}"`;
      }
      return cell;
    }).join(",")
  );
  return [headers.join(","), ...rows].join("\n");
};

console.log("🚀 Start generating Csv's...");

const validAirportsSet = new Set(
  airportData.airports
    .filter(item => item.fs && item.iata)
    .map(item => item.fs)
);

// 1. Airports
const airportsCSV = airportData.airports
  .filter(item => item.iata)
  .map(item => ({
    fs: item.fs,
    name: item.name,
    latitude: item.latitude,
    longitude: item.longitude,
    countrycode: item.countrycode,
    countryname: item.countryname,
    city: item.city
  }));
fs.writeFileSync("airports.csv", convertToCSV(airportsCSV, ["fs", "name", "latitude", "longitude", "countrycode", "countryname", "city"]));

// 2. Routes
const routesCSV = routes
  .filter(i => 
    i.STOPS === 0 && 
    validAirportsSet.has(i.START_AIRPORT) && 
    validAirportsSet.has(i.DESTINATION_AIRPORT) 
  )
  .map(i => ({
    stops: i.STOPS,
    departure_iata: i.START_AIRPORT,
    arrival_iata: i.DESTINATION_AIRPORT
  }));
fs.writeFileSync("routes.csv", convertToCSV(routesCSV, ["stops", "departure_iata", "arrival_iata"]));

// 3. Airlines
const airlinesCSV = airlinesData.airlines
  .filter(item => item.iata)
  .map(item => ({
    fs: item.fs,
    name: item.name,
    iata: item.iata,
    icao: item.icao
  }));
fs.writeFileSync("airlines.csv", convertToCSV(airlinesCSV, ["fs", "name", "iata", "icao"]));

// 4. Flights
const flightsCSV = flights.scheduledFlights.map(item => ({
  airlineFsCode: item.carrierFsCode,
  stops: item.stops,
  departureAirportFs: item.departureAirportFsCode,
  arrivalAirportFs: item.arrivalAirportFsCode,
  departureTime: item.departureTime,
  arrivalTime: item.arrivalTime
}));
fs.writeFileSync("flights.csv", convertToCSV(flightsCSV, ["airlineFsCode", "stops", "departureAirportFs", "arrivalAirportFs", "departureTime", "arrivalTime"]));

// 5. Route Info (Waypoints)
const allWaypoints = [];
fs.readdirSync(waypointfolder).forEach((file) => {
  const filename = file.slice(0, 7);
  const [departure, arrival] = filename.split("_");
  const waypoints = JSON.parse(fs.readFileSync(path.join(waypointfolder, file), "utf8"));

  waypoints.forEach(waypoint => {
    allWaypoints.push({
      position_time: waypoint.Timestamp,
      position: waypoint.Position,
      altitude: waypoint.Altitude,
      direction: waypoint.Direction,
      departure_iata: departure,
      arrival_iata: arrival
    });
  });
});
fs.writeFileSync("route_info.csv", convertToCSV(allWaypoints, ["position_time", "position", "altitude", "direction", "departure_iata", "arrival_iata"]));

console.log("✅ All CSV files are generated!");