import { getMatrix } from '../maps/mapsAPI.js';
import { getMunicipisGeoOrderedByDistanceDB } from '../database/dbUtils.js';

// BACK TRACKING ALGORITHM
// Recursive function to calculate the optimal route for each day of the week and each block of each lot taking into account the restrictions
export const computeRoute = async (i, j, notVisited, startingPoint, currentPoint, currentTime, workingHours, truckVel, path, maxNumMunicipisDia, distanceCache) => {
  const getDistance = async (origin, destination) => {
    // Check if the distance is already in the cache and get it. If not, call the Google Maps API to get it and save it in the cache
    // This way we avoid calling the Google Maps API multiple times for the same distance, which saves time and money
    const key1 = `${origin}-${destination}`;
    const key2 = `${destination}-${origin}`; // A->B and B->A, so we don't miss any distance

    if (distanceCache.has(key1)) {
      const dist = distanceCache.get(key1);
      if (origin !== destination) {
        if (dist != 0) return dist;
      }
      else return 0;
    }

    else if (distanceCache.has(key2)) {
      const dist = distanceCache.get(key2);
      if (origin !== destination) {
        if (dist != 0) return dist;
      }
      else return 0;
    }

    const result = await getMatrix([origin], [destination]); // Call the Google Maps API to get the distances between the two points
    distanceCache.set(key1, result.distance); // Save the distance in the cache
    return result.distance;
    }

    const distanceInfo = await getDistance(currentPoint.municipiInfo, startingPoint.municipiInfo);
    if (notVisited.size == 0 || path.elements.length >= maxNumMunicipisDia || currentTime + distanceInfo/truckVel > workingHours) {
      // Previously, abort flag was set to true here. Now it is passed as a parameter to the function
      path.time = currentTime + parseFloat(distanceInfo/truckVel);
      global.abort = true;
      return;
    }
    const nearby = await getMunicipisGeoOrderedByDistanceDB(currentPoint.municipiId, j+1);

    for (let l = 0; l < nearby.length; ++l) {
      if (notVisited.has(nearby[l].municipiInfo)) {
        const toNearbyDistance = await getDistance(currentPoint.municipiInfo, nearby[l].municipiInfo);
        const backToStartDistance = await getDistance(nearby[l].municipiInfo, startingPoint.municipiInfo);
        console.log(`${currentPoint.municipiInfo} -> ${nearby[l].municipiInfo} (${Math.round(toNearbyDistance)}km) | ${nearby[l].municipiInfo} -> ${startingPoint.municipiInfo} (${Math.round(backToStartDistance)}km)`);

        const totalTime = parseFloat(currentTime + toNearbyDistance/truckVel + backToStartDistance/truckVel);
        if (totalTime > workingHours) continue;
        const time = parseFloat(toNearbyDistance/truckVel + currentPoint.estanciaMin);
              
        notVisited.delete(nearby[l].municipiInfo);
        path.elements.push(nearby[l]);
        await computeRoute(i, j, notVisited, startingPoint, nearby[l], parseFloat(currentTime + time), workingHours, truckVel, path, maxNumMunicipisDia, distanceCache);
        if (global.abort) return;
        notVisited.add(nearby[l].municipiInfo);
        path.elements.pop();
        };
    };
};
