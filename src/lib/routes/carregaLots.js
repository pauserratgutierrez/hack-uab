import { getMunicipisByLotsAndBlocsDB } from '../database/dbUtils.js';

export const carregaLots = async (numLots) => {
  return Promise.all(numLots.map(async (lot) => {
    const blocs = [];
    for (let bloc = 1; bloc <= 4; ++bloc) {
      const municipis = await getMunicipisByLotsAndBlocsDB(lot, bloc);
      blocs.push(municipis);
    }
    return blocs;
  }));
};

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