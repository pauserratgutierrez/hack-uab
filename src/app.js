import { calcularRuta, formatRouteDataJSON, formatOutputNicely } from './lib/getRoutes.js';

// ANTERIOR
// const main = async () => {
//   const data = await computGlobal();
//   for (let i = 0; i < data.length; ++i) {
//     const {lot, bloc, dia, tempsRuta, distanciaRuta} = data[i];
//     const municipis = [];
//     for(let j = 0; j < data[i].municipis.length; ++j){
//       const { latitude, longitude } = data[i].municipis[j].municipiGeo;
//       const { municipiId, municipiInfo, pobTotalNum, estanciaMin} = data[i].municipis[j];
//       municipis.push({municipiId, latitude, longitude, municipiInfo, pobTotalNum, estanciaMin});
//     }
//     console.log({ lot, bloc, dia, tempsRuta, distanciaRuta, municipis });
//   }

//   for (let i = 0; i < data.length; ++i) {
//     const {lot, bloc, dia, tempsRuta, distanciaRuta} = data[i];
//     console.log(`lot: ${lot}, setmana: ${bloc}`);
//     console.log(`dia: ${dia}`);
//     console.log(`durada jornada: ${tempsRuta}`);
//     process.stdout.write('municipis: ')
//     for(let j = 0; j < data[i].municipis.length; ++j){
//       if(j > 0) process.stdout.write(' -> ');

//       const municipiInfo = data[i].municipis[j].municipiInfo;
//       process.stdout.write(municipiInfo);
      
//     }
//     console.log('\n');
//   }
// };

// await main().then(() => {
//   process.exit(0);
// });

const main = async () => {
  const dataJSON = await calcularRuta();
  const dataNice = formatRouteDataJSON(dataJSON);

  console.log(JSON.stringify(dataJSON, null, 2)); // Returns the grouped data in JSON format
  console.log(formatOutputNicely(dataNice)); // Returns the grouped data in a nice format 
};

await main().then(() => {
  process.exit(0);
});
