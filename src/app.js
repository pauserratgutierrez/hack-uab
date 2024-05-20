import { mainCalcularRuta } from './lib/routes/mainCalcularRuta.js';
import { formatRouteDataJSON, formatRouteDataNice } from './lib/routes/formatData.js';

const main = async () => {
  const restingHours = 1;
  const marginHours = 0.5;
  const truckVel = 75; // Truck velocity (km/h)
  const maxNumMunicipisDia = 6; // Maximum number of municipalities to visit in a day
  const numLots = [2, 4, 5];

  const data = await mainCalcularRuta(restingHours, marginHours, truckVel, maxNumMunicipisDia, numLots);
  const dataJSON = formatRouteDataJSON(data);
  const dataNice = formatRouteDataNice(dataJSON);

  console.log(JSON.stringify(dataJSON, null, 2)); // Returns the grouped data in JSON format
  console.log(dataNice); // Returns the grouped data in a nice format
};

await main().then(() => {
  process.exit(0);
});
