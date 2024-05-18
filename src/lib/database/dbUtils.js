import { connection } from './dbConn.js';

export async function getMunicipisFormatedDB() {
  const result = await connection.query(`SELECT id, municipi, comarca FROM municipis;`);
  if (result === 0) return null;

  const data = [];
  for (const row of result[0]) {
    data.push({ municipiId: row.id, municipiInfo: `${row.municipi}, ${row.comarca}` });
  };
  return data;
};

// Ordenar tots els municipis d'un lot i bloc determinat per distància mitjançant municipis_geo que conté les coords lat i long

const parseTime = (time) => {
  const t = time.split(':');
  return parseFloat(t[0]) + parseFloat(t[1]/60) + parseFloat(t[2]/3600); 
};

export async function getMunicipisByLotsAndBlocsDB(lotNum, blocNum) {
  const result = await connection.query('SELECT municipi, comarca, estancia_min, pob_total_num FROM municipis WHERE lot = ? AND bloc = ?;', [lotNum, blocNum]);
  if (result === 0) return null;

  const data = [];
  for (const row of result[0]) {
    const municipiInfo = `${row.municipi}, ${row.comarca}`;
    const estanciaMin = parseTime(row.estancia_min); 
    const pobTotalNum = row.pob_total_num;
    data.push({ municipiInfo, estanciaMin, pobTotalNum });
  };
  return data;
};

export async function addMunicipiGeoDB(municipiId, lat, lng) {
  const query = `INSERT INTO municipis_geo (municipi_id, geopoint) VALUES (?, ST_SRID(ST_GeomFromText('POINT(${lng} ${lat})'), 4326))`;
  const result = await connection.query(query, [municipiId]);
  if (result === 0) return null;
  return result[0];
};

export async function getMunicipiGeoDB(municipiId) {
  const query = `SELECT municipi_id, ST_AsText(geopoint) AS geopoint FROM municipis_geo WHERE municipi_id = ?`;
  const result = await connection.query(query, [municipiId]);
  if (rows.length === 0) return null;

  // Parse the POINT value to extract coordinates
  const [latitude, longitude] = rows[0].geopoint.replace('POINT(', '').replace(')', '').split(' ').map(Number);
  return { municipi_id: rows[0].municipi_id, latitude, longitude };
};