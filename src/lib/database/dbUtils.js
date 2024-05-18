import { connection } from './dbConn.js';

export async function getMunicipisDB() {
  const result = await connection.query(`SELECT municipi, comarca FROM municipis;`);
  const data = [];
  for (const row of result[0]) {
    data.push(`${row.municipi}, ${row.comarca}`);
  };
  return data;
};

// Ordenar tots els municipis d'un lot i bloc determinat per distància mitjançant municipis_geo que conté les coords lat i long

export async function getMunicipisLotsDB(lotNum, blocNum) {
  const result = await connection.query('SELECT municipi, comarca, estancia_min, pob_total_num FROM municipis WHERE lot = ? AND bloc = ?;', [lotNum, blocNum]);
  const data = [];
  for (const row of result[0]) {
    const municipiInfo = `${row.municipi}, ${row.comarca}`;
    const estanciaMin = row.estancia_min;
    const pobTotalNum = row.pob_total_num;
    data.push({ municipiInfo, estanciaMin, pobTotalNum });
  };
  return data;
};

const municipis = await getMunicipisLotsDB(2, 1);
console.log(municipis[0].municipiInfo);
