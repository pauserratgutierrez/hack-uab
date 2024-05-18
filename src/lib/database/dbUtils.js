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

const parseTime = (time) => {
  const t = time.split(':');
  return parseFloat(t[0]) + parseFloat(t[1]/60) + parseFloat(t[2]/3600); 
};

export async function getMunicipisByLotsAndBlocsDB(lotNum, blocNum) {
  const result = await connection.query('SELECT municipi_id, municipi, comarca, estancia_min, pob_total_num FROM municipis WHERE lot = ? AND bloc = ?;', [lotNum, blocNum]);
  if (result === 0) return null;

  const data = [];
  for (const row of result[0]) {
    const municipiId = row.municipi_id;
    const municipiInfo = `${row.municipi}, ${row.comarca}`;
    const estanciaMin = parseTime(row.estancia_min); 
    const pobTotalNum = row.pob_total_num;
    data.push({ municipiId, municipiInfo, estanciaMin, pobTotalNum });
  };
  return data;
};

export async function addMunicipiGeoDB(municipiId, lat, lng) {
  const query = `INSERT INTO municipis_geo (municipi_id, geopoint) VALUES (?, ST_SRID(ST_GeomFromText('POINT(${lat} ${lng})'), 4326))`;
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


// Ordenar tots els municipis d'un lot i bloc determinat per distància mitjançant municipis_geo que conté les coords lat i long
// Get all the municipis geopoints ordered by distance from a given municipi id, joining the municipis table to retrieve WHERE lot and bloc
export async function getMunicipisGeoOrderedByDistanceDB(municipiId, blocNum) {
  // SET @given_municipi_id = 1; -- Replace with the actual municipi id

  // -- Get the geopoint of the given municipi
  // SELECT @given_geopoint := geopoint FROM municipis_geo WHERE municipi_id = @given_municipi_id;
  
  // -- Query to get all municipis ordered by distance from the given municipi, within the same lot and bloc
  // SELECT m.id, m.lot, m.bloc, m.comarca, m.codi_ine, m.municipi, m.pob_total_num, m.estancia_min,
  //   ST_Distance_Sphere(geo.geopoint, @given_geopoint) AS distance
  // FROM municipis m
  // JOIN municipis_geo geo ON m.id = geo.municipi_id
  // WHERE m.lot = (SELECT lot FROM municipis WHERE id = @given_municipi_id)
  //   AND m.bloc = (SELECT bloc FROM municipis WHERE id = @given_municipi_id)
  // ORDER BY distance;

  // 2ND VEWRSION --------------
  // -- Replace 1 with the actual municipi id
  // SELECT 
  //   m.id, 
  //   m.lot, 
  //   m.bloc, 
  //   m.comarca, 
  //   m.codi_ine, 
  //   m.municipi, 
  //   m.pob_total_num, 
  //   m.estancia_min,
  //   ST_Distance_Sphere(geo.geopoint, gm.geopoint) AS distance
  // FROM 
  //   municipis m
  // JOIN 
  //   municipis_geo geo 
  // ON 
  //   m.id = geo.municipi_id
  // JOIN 
  //   (SELECT lot, bloc, geopoint 
  //    FROM municipis m 
  //    JOIN municipis_geo geo 
  //    ON m.id = geo.municipi_id 
  //    WHERE m.id = 1) gm
  // ON 
  //   m.lot = gm.lot 
  //   AND m.bloc = gm.bloc
  // ORDER BY 
  //   distance;
  
  const query = `
    SELECT m.id, m.lot, m.bloc, m.comarca, m.codi_ine, m.municipi, m.pob_total_num, m.estancia_min,
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
    const municipiInfo = `${row.municipi}, ${row.comarca}`;
    const pobTotalNum = row.pob_total_num;
    const estanciaMin = parseTime(row.estancia_min);
    data.push({ municipiId, municipiInfo, pobTotalNum, estanciaMin });
  };

  return data;
};
