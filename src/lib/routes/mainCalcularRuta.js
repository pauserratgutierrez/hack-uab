import { addCacheDB, getCacheDB, getStartingPointsDB } from '../database/dbUtils.js';
import { carregaLots } from './carregaLots.js';
import { getRoutes } from './getRoutes.js';

export const mainCalcularRuta = async (restingHours, marginHours, truckVel, maxNumMunicipisDia, numLots) => {
  // Personalize some values for the specific execution case
  const workingHours = 8 - restingHours - marginHours;

  const distanceCache = await getCacheDB(); // Load the cache from the db in memory

  const startingPoints = await getStartingPointsDB();
  const lots = await carregaLots(numLots);
  const result = await getRoutes(lots, startingPoints, workingHours, truckVel, maxNumMunicipisDia, numLots, distanceCache);
  await addCacheDB(distanceCache);

  return result;
};
