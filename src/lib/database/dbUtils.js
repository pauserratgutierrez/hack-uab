import { connection } from './dbConn.js';

// Get Cache
export async function getCacheDB() {
  try {
    const result = await connection.query('SELECT * FROM cache_distance;');
    if (result === 0) return null;
  
    // Return as a Map() with the keys and contents of the cache from DB
    const cache = new Map();
    for (const row of result[0]) {
      cache.set(row.key_dist, row.content);
    };
    return cache;
  } catch (e) {
    console.log(e);
  };
};

export async function addCacheDB(cacheMap) {
  try {
    for(const [key, content] of cacheMap.entries()) {
      console.log("contentdistance", content)
      const query = `INSERT IGNORE INTO cache_distance (key_dist, content) VALUES (?, ?)`;
      const result = await connection.query(query, [key, content]);
      if (result === 0) return null;
    };
  } catch (e) {
    console.log(e);
  };
};

// Search in municipis where bloc = -1
export async function getStartingPointsDB() {
  try {
    const result = await connection.query('SELECT id, municipi, comarca, estancia_min, pob_total_num FROM municipis WHERE bloc = -1;');
    if (result === 0) return null;
  
    const data = [];
    for (const row of result[0]) {
      const municipiId = row.id;
      const municipiInfo = `${row.municipi}, ${row.comarca}`;
      const estanciaMin = parseTime(row.estancia_min); 
      const pobTotalNum = row.pob_total_num;
      data.push({ municipiId, municipiInfo, estanciaMin, pobTotalNum });
    };
    return data;
  } catch (e) {
    console.log(e);
  };
};

export async function getMunicipisFormatedDB() {
  try {
    const result = await connection.query(`SELECT id, municipi, comarca FROM municipis;`);
    if (result === 0) return null;
  
    const data = [];
    for (const row of result[0]) {
      data.push({ municipiId: row.id, municipiInfo: `${row.municipi}, ${row.comarca}` });
    };
    return data;
  } catch (e) {
    console.log(e);
  };
};

const parseTime = (time) => {
  const t = time.split(':');
  return parseFloat(t[0]) + parseFloat(t[1]/60) + parseFloat(t[2]/3600); 
};

export async function getMunicipisByLotsAndBlocsDB(lotNum, blocNum) {
  try {
    const result = await connection.query('SELECT id, municipi, comarca, estancia_min, pob_total_num FROM municipis WHERE lot = ? AND bloc = ?;', [lotNum, blocNum]);
    if (result === 0) return null;
  
    const data = [];
    for (const row of result[0]) {
      const municipiId = row.id;
      const municipiInfo = `${row.municipi}, ${row.comarca}`;
      const estanciaMin = parseTime(row.estancia_min); 
      const pobTotalNum = row.pob_total_num;
      data.push({ municipiId, municipiInfo, estanciaMin, pobTotalNum });
    };
    return data;
  } catch (e) {
    console.log(e);
  };
};

export async function addMunicipiGeoDB(municipiId, lat, lng) {
  try {
    const query = `INSERT INTO municipis_geo (municipi_id, geopoint) VALUES (?, ST_SRID(ST_GeomFromText('POINT(${lat} ${lng})'), 4326))`;
    const result = await connection.query(query, [municipiId]);
    if (result === 0) return null;
    return result[0];
  } catch (e) {
    console.log(e);
  };
};

export async function getMunicipiGeoDB(municipiId) {
  try {
    const query = `SELECT municipi_id, ST_AsText(geopoint) AS geopoint FROM municipis_geo WHERE municipi_id = ?`;
    const result = await connection.query(query, [municipiId]);
    if (rows.length === 0) return null;
  
    // Parse the POINT value to extract coordinates
    const [latitude, longitude] = rows[0].geopoint.replace('POINT(', '').replace(')', '').split(' ').map(Number);
    return { municipi_id: rows[0].municipi_id, latitude, longitude };
  } catch (e) {
    console.log(e);
  };
};

// Ordenar tots els municipis d'un lot i bloc determinat per distància mitjançant municipis_geo que conté les coords lat i long
export async function getMunicipisGeoOrderedByDistanceDB(municipiId, blocNum) {  
  try {
    const query = `
    SELECT m.id, m.lot, m.bloc, m.comarca, m.codi_ine, m.municipi, m.pob_total_num, m.estancia_min, gm.geopoint,
      ST_Distance_Sphere(geo.geopoint, gm.geopoint) AS distance
    FROM 
      municipis m
    JOIN 
      municipis_geo geo 
    ON 
      m.id = geo.municipi_id
    JOIN 
      (SELECT lot, geopoint FROM municipis m 
        JOIN municipis_geo geo ON m.id = geo.municipi_id WHERE m.id = ?) gm
    ON 
      m.lot = gm.lot AND m.bloc = ?
    ORDER BY distance;
  `;

  const result = await connection.query(query, [municipiId, blocNum]);
  if (result === 0) return null;

  const data = [];
  for (const row of result[0]) {
    const municipiId = row.id;
    const municipiGeo = { latitude: row.geopoint.x, longitude: row.geopoint.y };
    const municipiInfo = `${row.municipi}, ${row.comarca}`;
    const pobTotalNum = row.pob_total_num;
    const estanciaMin = parseTime(row.estancia_min);
    data.push({ municipiId, municipiGeo, municipiInfo, pobTotalNum, estanciaMin });
  };

  return data;
  } catch (e) {
    console.log(e);
  };
};
