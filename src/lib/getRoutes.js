import { getMatrix } from './mapsAPI.js';

var lots = [[[],[],[],[]],[[],[],[],[]],[[],[],[],[]]];

//afegir funcio per cardar dades a lots

const workingHours = 8;
const restingHours = 1;
const marginHours = 0.5;

const truckVel = 60; // m/h

const startingPoints = ["Girona", "Barcelona", "Tarragona"];

const computeRoute = async (lots, i, j, k, visited, startingPoint, currentPoint, currentTime, workingHours, restingHours, marginHours, truckVel, path, acabar) => {
    const distanceInfo = await getMatrix([currentPoint], [startingPoint]);
    if (currentTime + distanceInfo.distance/truckVel > workingHours - restingHours - marginHours) { // afegir counter que comprovi quants queden
        acabar = true;
        return;
    }

    const currentPoint = path[path.length - 1];
    const nearby = getNearbyCities(currentPoint);

    for (let l = 0; l < visited; ++l) {
        if (!visited[l]){

            const time = await getMatrix([currentPoint], [lots[i][j][l]]).distance/truckVel + getTime(currentPoint);
            if (time <= workingHours) {
                visited[l] = true;
                path.push(lots[i][j][l]);
                computeRoute(lots, i, j, k, visited, startingPoint, currentTime + time, workingHours, restingHours, marginHours, truckVel, path, visited, acabar);
                if (acabar) return;
                visited[l] = false;
                path.pop();
            }
        }
    }
    return path;
}

const getRoutes = async (lots, startingPoints, workingHours, restingHours, marginHours, truckVel) => {
    const routes = [];
    for (let i = 0; i < lots.length; ++i) {
        //recorrer cada lot
        routes.push([]);
        for (let j = 0; j < lots[i].length; ++j) {
            //recorrer cada bloc 
            routes[i].push([]);
            //make an array size 5 initialized to false
            const visited = new Array(lots[i][j].length).fill(false);

            for (let k = 0; k < 5; ++k) {
                const path = [];
                let acabar = false;
                const visited = new Array(nearby.length).fill(false);
                computeRoute(lots, i, j, k, visited, startingPoints[i], 0, workingHours, restingHours, marginHours, truckVel, path, visited, acabar);  
                routes[i][j].push(path);
            }
        }
    }

}


    // for (let i = 0; i < lots.length; ++i) {
    //     //recorrer cada lot
    //     routes.push([]);
    //     for (let j = 0; j < lots[i].length; ++j) {
    //         //recorrer cada bloc
    //         routes[i].push([]);
    //         //make an array size 5 initialized to false
    //         const visited = new Array(lots[i][j].length).fill(false);

    //         for (let k = 0; k < 5; ++k) {
    //             //recorrer cada dia
    //             let remainingHours = workingHours - restingHours - marginHours;
    //             const dist = new Array(lots[i][j].length).fill(Infinity);
    //             const prev = new Array(lots[i][j].length).fill(-1);
    //             const pq = new Heap((a, b) => a.priority - b.priority);
    //             pq.push({priority: 0, content: startingPoints[i], index: -1});
    //             while(!pq.empty()){
    //                 const city = pq.pop();
    //                 if (city.index == -1 || !visited[city.index]) {
    //                     if(city.index != -1) visited[city.index] = true;

    //                     //canviar
    //                     let distance = getDistance(currentPoint, lots[i][j][l]);
    //                     let time = distance / truckVel;

    //                     //recorrer més propers
    //                     const nearby = getNearbyCities(city.content);

    //                     for (let l = 0; l < 5; ++l) {
    //                         if (visited[l]) continue;
    //                         distance = getDistance(currentPoint, lots[i][j][l]);
    //                         time = distance / truckVel;
    //                         if (time <= remainingHours) {
    //                             pq.push({priority: time, content: nearby[l], index: l});
    //                             prev[l] = city.index;
    //                         }
    //                     }

    //                     if (time <= remainingHours && distance <= maxDistance) {
    //                         routes[i][j][k].push(lots[i][j][l]);
    //                         visited[l] = true;
    //                         remainingHours -= time;
    //                         currentPoint = lots[i][j][l];
    //                     }
    //                 } 
    //             }
    //             routes[i][j].push(fixArray(prev));
    //         }
    //     }
    // }