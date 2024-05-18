var lots = [[[],[],[]],[[],[],[]],[[],[],[]]];

const workingHours = 8;
const restingHours = 1;
const marginHours = 0.5;

const truckVel = 60; // km/h

const startingPoints = ["Girona", "Barcelona", "Tarragona"];

const getRoutes = (lots, startingPoints) => {
    let routes = [];

    for (let i = 0; i < lots.length; ++i) {
        routes.push([]);
        for (let j = 0; j < lots[i].length; ++j) {
            routes[i].push([]);
            let visited = new Set();
            for (let k = 0; k < 7; ++k) {
                routes[i][j].push([]);
                //algorisme de pathfinding
                let remainingHours = workingHours - restingHours - marginHours;
                let currentPoint = startingPoints[i];
                for (let l = 0;  in lots[lot][bloc]){
                    if
                }
            }
            j++;
        }
        i++;
    }
}