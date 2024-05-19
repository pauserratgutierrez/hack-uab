// import { addMunicipiGeoDB } from './lib/database/dbUtils.js';
import { computGlobal } from './lib/getRoutes.js';

const main = async () => {
  const data = await computGlobal();
  for (let i = 0; i < data.length; ++i) {
    const {lot, bloc, dia, tempsRuta, distanciaRuta} = data[i];
    const municipis = [];
    for(let j = 0; j < data[i].municipis.length; ++j){
      // const municipiId = row.id;
      // const municipiGeo = { latitude: row.geopoint.x, longitude: row.geopoint.y };
      // const municipiInfo = `${row.municipi}, ${row.comarca}`;
      // const pobTotalNum = row.pob_total_num;
      // const estanciaMin = parseTime(row.estancia_min);
      const { latitude, longitude } = data[i].municipis[j].municipiGeo;

      const { municipiId, municipiInfo, pobTotalNum, estanciaMin} = data[i].municipis[j];
      municipis.push({municipiId, latitude, longitude, municipiInfo, pobTotalNum, estanciaMin});
      
    }
    console.log({ lot, bloc, dia, tempsRuta, distanciaRuta, municipis });
    //municipis: routes[i][j][k].elements
  }

  for (let i = 0; i < data.length; ++i) {
    const {lot, bloc, dia, tempsRuta, distanciaRuta} = data[i];
    console.log(`lot: ${lot}, setmana: ${bloc}`);
    console.log(`dia: ${dia}`);
    console.log(`durada jornada: ${tempsRuta}`);
    process.stdout.write('municipis: ')
    for(let j = 0; j < data[i].municipis.length; ++j){
      if(j > 0) process.stdout.write(' -> ');

      const municipiInfo = data[i].municipis[j].municipiInfo;
      process.stdout.write(municipiInfo);
      
    }
    console.log('\n');
  }
}; 
await main();

// Acabem el programa
process.exit(0);
