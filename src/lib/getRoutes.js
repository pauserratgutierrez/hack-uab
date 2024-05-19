import { getMatrix } from './mapsAPI.js';
import { getStartingPointsDB } from './database/dbUtils.js';
import { getMunicipisGeoOrderedByDistanceDB } from './database/dbUtils.js';
import { getMunicipisByLotsAndBlocsDB } from './database/dbUtils.js';

const restingHours = 1;
const marginHours = 0.5;
const workingHours = 8 - restingHours - marginHours;

const truckVel = 75; // km/h
const maxNumMunicipisDia = 6; // posar num municipis

// posar mitjana de temps

const numLots = [2, 4, 5];

let abort = false;

let count = 0;
        
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


//afegir funcio per cardar dades a lots

const computeRoute = async (i, j, notVisited, startingPoint, currentPoint, currentTime, workingHours, truckVel, path) => {
    const distanceInfo = await getMatrix([currentPoint.municipiInfo], [startingPoint.municipiInfo]);
    ++count;
    // await new Promise(resolve => setTimeout(resolve, 20));
    if (notVisited.size == 0 || path.elements.length >= maxNumMunicipisDia || currentTime + distanceInfo.distance/truckVel > workingHours) {
        abort = true;
        path.time = currentTime + distanceInfo.distance/truckVel;
        return;
    }
    const nearby = await getMunicipisGeoOrderedByDistanceDB(currentPoint.municipiId, j+1);
    
    for (let l = 0; l < nearby.length; ++l) {
        if (notVisited.has(nearby[l].municipiInfo) || currentTime + await getMatrix([currentPoint.municipiInfo], [nearby[l].municipiInfo]) + nearby[l].estanciaMin + await getMatrix([nearby[l].municipiInfo], [startingPoint.municipiInfo]) <= workingHours + marginHours){

            const distanceInfo = await getMatrix([currentPoint.municipiInfo], [nearby[l].municipiInfo])
            ++count;
            const time = parseFloat(distanceInfo.distance/truckVel + currentPoint.estanciaMin);
            //console.log("time", time);
            
            notVisited.delete(nearby[l].municipiInfo);
            path.elements.push(nearby[l]);
            await computeRoute(i, j, notVisited, startingPoint, nearby[l], currentTime + time, workingHours, truckVel, path);
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

const getRoutes = async (lots, startingPoints, workingHours, restingHours, marginHours, truckVel) => {
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
console.log("startingPoints", startingPoints);
const lots = await carregaLots();
console.log("lots", lots);
const result = await getRoutes(lots, startingPoints, workingHours, restingHours, marginHours, truckVel); 
for (let i = 0; i < result.length; ++i) {
    console.log(result[i]);
}
//id, temps total, imprimir globals
