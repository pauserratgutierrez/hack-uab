
var lots = [[[],[],[],[]],[[],[],[],[]],[[],[],[],[]]];

const workingHours = 8;
const restingHours = 1;
const marginHours = 0.5;

const truckVel = 60; // km/h

const startingPoints = ["Girona", "Barcelona", "Tarragona"];

const computeRoute = (lots, i, j, k, visited, startingPoint, currentPoint, currentTime, workingHours, restingHours, marginHours, truckVel, path) => {
    if (currentTime + getDistance(currentPoint, startingPoint)/truckVel > workingHours - restingHours - marginHours) return;

    const currentPoint = path[path.length - 1];
    const nearby = getNearbyCities(currentPoint);
    const visited = new Array(nearby.length).fill(false);

    for (let l = 0; l < visited; ++l) {
        if (!visited[l]){
            const distance = getDistance(currentPoint, lots[i][j][l]);
            const time = distance / truckVel + getTime(currentPoint);
            if (time <= workingHours) {
                visited[l] = true;
                path.push(lots[i][j][l]);
                computeRoute(lots, i, j, k, visited, startingPoint, currentTime + time, workingHours, restingHours, marginHours, truckVel, path);
                visited[l] = false;
                path.pop();
            }
        }
    }

    return path;
}

async function getRoutes(lots, startingPoints, workingHours, restingHours, marginHours, truckVel) {
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
                computeRoute(lots, i, j, k, visited, startingPoints[i], 0, workingHours, restingHours, marginHours, truckVel, path);  
                routes[i][j].push(path);
            }
        }
    }

}

class Graph {
    constructor() {
        this.adjacencyList = new Map();
    }

    addNode(node) {
        this.adjacencyList.set(node, []);
    }

    addEdge(node1, node2, weight) {
        this.adjacencyList.get(node1).push({ node: node2, weight: weight });
        this.adjacencyList.get(node2).push({ node: node1, weight: weight });
    }
}

function findBestCycle(graph, startNode, maxCost) {
    let bestCycle = [];
    let bestCycleWeight = Infinity;
    let bestCycleNodes = 0;

    function dfs(currentNode, visited, path, currentWeight) {
        if (currentWeight > maxCost) return;

        // Check if a cycle is formed
        if (currentNode === startNode && path.length > 1) {
            if (path.length > bestCycleNodes || (path.length === bestCycleNodes && currentWeight < bestCycleWeight)) {
                bestCycleNodes = path.length;
                bestCycleWeight = currentWeight;
                bestCycle = path.slice();
            }
            return;
        }

        for (let neighbor of graph.adjacencyList.get(currentNode)) {
            if (!visited.has(neighbor.node) || (neighbor.node === startNode && path.length > 1)) {
                visited.add(neighbor.node);
                path.push(neighbor.node);
                dfs(neighbor.node, visited, path, currentWeight + neighbor.weight);
                path.pop();
                visited.delete(neighbor.node);
            }
        }
    }

    const visited = new Set([startNode]);
    dfs(startNode, visited, [startNode], 0);

    return { cycle: bestCycle, weight: bestCycleWeight };
}

// Example Usage:
const graph = new Graph();
graph.addNode(0);
graph.addNode(1);
graph.addNode(2);
graph.addNode(3);

graph.addEdge(0, 1, 10);
graph.addEdge(0, 2, 15);
graph.addEdge(1, 2, 35);
graph.addEdge(1, 3, 25);
graph.addEdge(2, 3, 30);

const startNode = 0;
const maxCost = 50;
const result = findBestCycle(graph, startNode, maxCost);

console.log('Best cycle:', result.cycle);
console.log('Cycle weight:', result.weight);


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
