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

const parseTime = (time) => {
  const time = row.estancia_min.split(':');
  const estanciaMin = time[2] + time[1]/60 + time[0]/3600; ; 
}

export async function getMunicipisLotsDB(lotNum, blocNum) {
  const result = await connection.query('SELECT municipi, comarca, estancia_min, pob_total_num FROM municipis WHERE lot = ? AND bloc = ?;', [lotNum, blocNum]);
  const data = [];
  for (const row of result[0]) {
    const municipiInfo = `${row.municipi}, ${row.comarca}`;
    const estanciaMin = parseTime(row.estancia_min); 
    const pobTotalNum = row.pob_total_num;
    data.push({ municipiInfo, estanciaMin, pobTotalNum });
  };
  return data;
};
