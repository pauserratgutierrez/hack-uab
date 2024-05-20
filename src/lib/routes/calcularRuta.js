import { addCacheDB, getCacheDB, getStartingPointsDB } from '../database/dbUtils.js';
import { carregaLots } from './carregaLots.js';
import { computeRoute } from './algorithm.js';

export const calcularRuta = async (restingHours, marginHours, truckVel, maxNumMunicipisDia, numLots) => {
  // Personalize some values for the specific execution case
  const workingHours = 8 - restingHours - marginHours;

  const distanceCache = await getCacheDB(); // Load the cache from the db in memory

  const tojson = (routes) => {
    const result = [];
      for (let i = 0; i < routes.length; ++i) {
        for (let j = 0; j < routes[i].length; ++j) {
          for (let k = 0; k < routes[i][j].length; ++k) {
            result.push({
              lot: numLots[i],
              bloc: j+1,
              dia: k,
              tempsRuta: routes[i][j][k].time,
              distanciaRuta: routes[i][j][k].time * truckVel,
              municipis: routes[i][j][k].elements
            });
          }
        }
      }
    return result;
  };

  const getRoutes = async (lots, startingPoints, workingHours, truckVel) => {
    const routes = [];
    for (let i = 0; i < lots.length; ++i) {
      //recorrer cada lot
      routes.push([]);
      for (let j = 0; j < lots[i].length; ++j) {
        //recorrer cada bloc 
        routes[i].push([]);
        //make an array size 5 initialized to false
        const notVisited = new Set();
        for(let k = 0; k < lots[i][j].length; ++k) {
          notVisited.add(lots[i][j][k].municipiInfo);
        }

        for (let k = 0; k < 5; ++k) {
          const path = {elements: [], time: 0};
            await computeRoute(i, j, notVisited, startingPoints[i], startingPoints[i], 0, workingHours, truckVel, path, maxNumMunicipisDia, distanceCache);  
              routes[i][j].push(path);
            }
          }
      }
      return tojson(routes);
  }

  const startingPoints = await getStartingPointsDB();
  const lots = await carregaLots(numLots);
  const result = await getRoutes(lots, startingPoints, workingHours, truckVel);
  await addCacheDB(distanceCache);

  return result;
};
