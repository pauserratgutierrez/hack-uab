import { calcularRuta } from './lib/routes/calcularRuta.js';
import { formatRouteDataJSON, formatRouteDataNice } from './lib/routes/formatData.js';

async function main() {

  const workingDays = 5; // Working days per week
  
  const workdayHours = 8; // Working hours per day
  const restingHours = 1; // Resting hours per day, additional to the margin hours and commuting time!
  const marginHours = 0.5; // Margin hours per day
  
  const truckVel = 75; // Truck velocity (km/h)
  const maxNumMunicipisDia = 10; // Maximum number of municipalities to visit in a day. If this is too low, the algorithm may not find a solution!
  const numLots = [2, 4, 5];

  console.log(`Calculant la millor ruta...\nTreball: ${workingDays}d/setmana, Jornada Laboral: ${workdayHours}h/dia, Descans: ${restingHours}h/dia, Marge: ${marginHours}h/dia, Velocitat mitjana: ${truckVel}km/h, Límit municipis: ${maxNumMunicipisDia}/dia, Lots carregats: ${numLots}`);

  const data = await calcularRuta(workingDays, workdayHours, restingHours, marginHours, truckVel, maxNumMunicipisDia, numLots);

  const dataJSON = formatRouteDataJSON(data); // Initial data returned and formated
  const dataNice = formatRouteDataNice(dataJSON); // Formated data for a better visualization

  // console.log(JSON.stringify(dataJSON, null, 2)); // Returns the grouped data in JSON format
  console.log(dataNice); // Returns the grouped data in a nice format
};

await main().then(() => {
  process.exit(0);
});
