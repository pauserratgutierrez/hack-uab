import { getMatrix } from './mapsAPI.js';
import { getMunicipisGeoOrderedByDistanceDB } from './database/dbUtils.js';
import { getMunicipisByLotsAndBlocsDB } from './database/dbUtils.js';

const workingHours = 8;
const restingHours = 1;
const marginHours = 0.5;

const truckVel = 60; // km/h

// posar mitjana de temps

console.log(await getMunicipisGeoOrderedByDistanceDB(1));
process.exit(0);

const startingPoints = ["Barcelona centre", "Girona centre", "Tarragona centre"];

const numLots = [2, 4, 5];

let abort = false;
        
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

const mock = (origins, destinations) => {
    const distance = Math.random()*200;
    return { distance };
};

const getTime = (currentPoint) => {
    return Math.random()*10;
}

//afegir funcio per cardar dades a lots

const computeRoute = (i, j, notVisited, startingPoint, currentPoint, currentTime, workingHours, restingHours, marginHours, truckVel, path) => {
    const distanceInfo = mock([currentPoint], [startingPoint]);
    if (notVisited.size == 0 || currentTime + distanceInfo.distance/truckVel > workingHours - restingHours - marginHours) {
        abort = true;
        return;
    }
    
    const nearby = getMunicipisGeoOrderedByDistanceDB(currentPoint.id);
    console.log("notVisited", notVisited);
    
    for (let l = 0; l < nearby.length; ++l) {
        if (notVisited.has(nearby[l].municipiInfo)){

            const distanceInfo = mock([currentPoint], [nearby[l].municipiInfo])
            const time = parseFloat(distanceInfo.distance/truckVel + getTime(currentPoint));
            console.log("time", time);
            
            notVisited.delete(nearby[l].municipiInfo);
            path.push(nearby[l].municipiInfo);
            computeRoute(i, j, notVisited, startingPoint, nearby[l].municipiInfo, currentTime + time, workingHours, restingHours, marginHours, truckVel, path);
            if (abort) return;
            notVisited.add(nearby[l].municipiInfo);
            path.pop();
        }
    }
}

const getRoutes = (lots, startingPoints, workingHours, restingHours, marginHours, truckVel) => {
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
            console.log("notVisited", notVisited);

            for (let k = 0; k < 5; ++k) {
                const path = [];
                abort = false;
                computeRoute(i, j, notVisited, startingPoints[i], startingPoints[i], 0, workingHours, restingHours, marginHours, truckVel, path);  
                routes[i][j].push(path);
            }
        }
    }
    return routes;
}


const lots = await carregaLots();
const result = getRoutes(lots, startingPoints, workingHours, restingHours, marginHours, truckVel);  
console.log(result);
