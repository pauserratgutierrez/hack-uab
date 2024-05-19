import { getMatrix } from './mapsAPI.js';
import { addCacheDB, getCacheDB, getStartingPointsDB } from './database/dbUtils.js';
import { getMunicipisGeoOrderedByDistanceDB } from './database/dbUtils.js';
import { getMunicipisByLotsAndBlocsDB } from './database/dbUtils.js';

export const computGlobal = async () => {
  const restingHours = 1;
  const marginHours = 0.5;
  const workingHours = 8 - restingHours - marginHours;

  const truckVel = 75; // km/h
  const maxNumMunicipisDia = 9; // posar num municipis

  const numLots = [2, 4, 5];

  let abort = false;

  const distanceCache = await getCacheDB();
            
  const carregaLots = async () => {
    const lots = [];
      for (let i = 0; i < numLots.length; ++i) {
        lots.push([]);
        for (let j = 1; j <= 4; ++j) {
          const mun = await getMunicipisByLotsAndBlocsDB(numLots[i], j);
          lots[i].push(mun);
        }
      }
      return lots;
  };

  const computeRoute = async (i, j, notVisited, startingPoint, currentPoint, currentTime, workingHours, truckVel, path) => {

    const getDistance = async (origin, destination) => {
      const key1 = `${origin} - ${destination}`;
      const key2 = `${destination} - ${origin}`;
      if (distanceCache.has(key1)) {
        console.log("cache hit");
        return distanceCache.get(key1);
      }
        else if (distanceCache.has(key2)) {
          console.log("cache hit");
          return distanceCache.get(key2);
        }
        const result = await getMatrix([origin], [destination]);
        distanceCache.set(key1, result.distance);
        console.log("cache miss");
        return result;
      }

      const distanceInfo = await getDistance(currentPoint.municipiInfo, startingPoint.municipiInfo);
      if (notVisited.size == 0 || path.elements.length >= maxNumMunicipisDia || currentTime + distanceInfo/truckVel > workingHours) {
        abort = true;
        path.time = currentTime + distanceInfo/truckVel;
        return;
      }
      const nearby = await getMunicipisGeoOrderedByDistanceDB(currentPoint.municipiId, j+1);
        
      for (let l = 0; l < nearby.length; ++l) {
        if (notVisited.has(nearby[l].municipiInfo)) {
          const toNearbyDistance = await getDistance(currentPoint.municipiInfo, nearby[l].municipiInfo);
          const backToStartDistance = await getDistance(nearby[l].municipiInfo, startingPoint.municipiInfo);

          const totalTime = parseFloat(currentTime + toNearbyDistance/truckVel + backToStartDistance/truckVel);
          if (totalTime > workingHours) {
            continue;
          }
          const time = parseFloat(toNearbyDistance/truckVel + currentPoint.estanciaMin);
                
          notVisited.delete(nearby[l].municipiInfo);
          path.elements.push(nearby[l]);
          await computeRoute(i, j, notVisited, startingPoint, nearby[l], parseFloat(currentTime + time), workingHours, truckVel, path);
          if (abort) return;
          notVisited.add(nearby[l].municipiInfo);
          path.elements.pop();
          }
      }
  }

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
            abort = false;
            await computeRoute(i, j, notVisited, startingPoints[i], startingPoints[i], 0, workingHours, truckVel, path);  
              routes[i][j].push(path);
            }
          }
      }
      return tojson(routes);
  }

  const startingPoints = await getStartingPointsDB();
  const lots = await carregaLots();
  const result = await getRoutes(lots, startingPoints, workingHours, truckVel); 
  console.log("result done");

  await addCacheDB(distanceCache);

  return result;
};
