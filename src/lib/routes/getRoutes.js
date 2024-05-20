import { computeRoute } from './algorithm.js';

export const getRoutes = async (lots, startingPoints, workingHours, truckVel, maxNumMunicipisDia, numLots, distanceCache) => {
  const routes = [];
  // Loop through each lot
  for (let i = 0; i < lots.length; ++i) {
    // Loop through each bloc
    for (let j = 0; j < lots[i].length; ++j) {
      const notVisited = new Set();
      
      for (let k = 0; k < lots[i][j].length; ++k) {
        notVisited.add(lots[i][j][k].municipiInfo);
      };

      for (let k = 0; k < 5; ++k) {
        const path = {elements: [], time: 0};
        await computeRoute(i, j, notVisited, startingPoints[i], startingPoints[i], 0, workingHours, truckVel, path, maxNumMunicipisDia, distanceCache);  

        routes.push({
          lot: numLots[i],
          bloc: j + 1,
          dia: k,
          tempsRuta: path.time,
          distanciaRuta: path.time * truckVel,
          municipis: path.elements.map((m) => ({
            id: m.municipiId,
            geo: m.municipiGeo,
            info: m.municipiInfo,
            pobTotalNum: m.pobTotalNum,
            estanciaMin: m.estanciaMin
          })),
        });
      };
    };
  };
  return routes;
};
