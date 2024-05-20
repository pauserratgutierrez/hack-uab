import { getMatrix } from './mapsAPI.js';
import { addCacheDB, getCacheDB, getStartingPointsDB, getMunicipisGeoOrderedByDistanceDB, getMunicipisByLotsAndBlocsDB } from './database/dbUtils.js';

export const calcularRuta = async () => {
  // Personalize some values for the specific execution case
  const restingHours = 1;
  const marginHours = 0.5;
  const workingHours = 8 - restingHours - marginHours;
  const truckVel = 75; // Truck velocity (km/h)
  const maxNumMunicipisDia = 9; // Maximum number of municipalities to visit in a day
  const numLots = [2, 4, 5];

  let abort = false; // Flag to abort the recursive function
  const distanceCache = await getCacheDB(); // Load the cache from the db in memory

  // ANTERIOR
  // Load the municipalities of each lot and bloc
  // const carregaLots = async () => {
  //   const lots = [];
  //   for (let i = 0; i < numLots.length; ++i) {
  //     lots.push([]);
  //     for (let j = 1; j <= 4; ++j) {
  //       const mun = await getMunicipisByLotsAndBlocsDB(numLots[i], j); // Get the municipalities of the log and block from the database
  //       lots[i].push(mun); // Save the municipalities in the array in memory
  //     };
  //   };
  //   return lots; // Return the array with the municipalities
  // };

  const carregaLots = async () => {
    return Promise.all(numLots.map(async (lot) => {
      const blocs = [];
      for (let bloc = 1; bloc <= 4; ++bloc) {
        const municipis = await getMunicipisByLotsAndBlocsDB(lot, bloc);
        blocs.push(municipis);
      }
      return blocs;
    }));
  };

  // BACK TRACKING ALGORITHM
  // Recursive function to calculate the optimal route for each day of the week and each block of each lot taking into account the restrictions
  const computeRoute = async (i, j, notVisited, startingPoint, currentPoint, currentTime, workingHours, truckVel, path) => {
    const getDistance = async (origin, destination) => {
      // Check if the distance is already in the cache and get it. If not, call the Google Maps API to get it and save it in the cache
      // This way we avoid calling the Google Maps API multiple times for the same distance, which saves time and money
      const key1 = `${origin}-${destination}`;
      const key2 = `${destination}-${origin}`; // A->B and B->A, so we don't miss any distance
      if (distanceCache.has(key1)) return distanceCache.get(key1);
      if (distanceCache.has(key2)) return distanceCache.get(key2);

      const result = await getMatrix([origin], [destination]); // Call the Google Maps API to get the distances between the two points
      distanceCache.set(key1, result.distance); // Save the distance in the cache
      return result.distance;
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
          // console.log(`${currentPoint.municipiInfo} -> ${nearby[l].municipiInfo} (${Math.round(toNearbyDistance)}km)`);
          // console.log(`${nearby[l].municipiInfo} -> ${startingPoint.municipiInfo} (${Math.round(backToStartDistance)}km)`);

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
  await addCacheDB(distanceCache);

  return result;
};

// Formats the data in JSON format
export const formatRouteDataJSON = (data) => {
  const groupedData = {};
  data.forEach(({ lot, bloc, dia, tempsRuta, municipis }) => {
    if (!groupedData[lot]) groupedData[lot] = {};
    if (!groupedData[lot][bloc]) groupedData[lot][bloc] = {};
    if (!groupedData[lot][bloc][dia]) groupedData[lot][bloc][dia] = [];
    const detailedMunicipis = municipis.map(({ municipiGeo: { latitude, longitude }, municipiId, municipiInfo, pobTotalNum, estanciaMin }) => ({
      municipiId,
      municipiGeo: { latitude, longitude },
      municipiInfo,
      pobTotalNum,
      estanciaMin
    }));
    groupedData[lot][bloc][dia].push({ tempsRuta, municipis: detailedMunicipis });
  });

  return groupedData;
};

// Formats the data in a more readable way suitable for a console output
export const formatOutputNicely = (data) => {
  const output = [];

  for (const lot in data) {
    output.push(`LOT: ${lot}`);
    for (const bloc in data[lot]) {
      output.push(`Setmana ${bloc}`);
      for (const dia in data[lot][bloc]) {
        data[lot][bloc][dia].forEach(({ tempsRuta, municipis }) => {
          const ruta = municipis.map(m => m.municipiInfo).join(' -> ');
          output.push(`Dia ${parseInt(dia) + 1} -> Jornada: ${tempsRuta.toFixed(2)}h | Ruta: ${ruta}`);
        });
      }
    }
  }

  return output.join('\n');
};
