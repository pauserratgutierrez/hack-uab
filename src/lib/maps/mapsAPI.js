import { Client } from '@googlemaps/google-maps-services-js';

// Initialize Google Maps API client
const client = new Client({ config: { params: { key: process.env.GOOGLE_MAPS_API_KEY } } });

// Get coordinates from an address
export async function geocode(address) {
  const response = await client.geocode({
    params: {
      address
    },
  });

  return response.data.results[0].geometry.location;
};

// Calculate distance between two addresses
export async function getMatrix(origins, destinations) {
  const response = await client.distancematrix({
    params: {
      origins,
      destinations
    },
  });

  const result = response.data;
  if (result.status === 'OK') {
    const distance = parseFloat(result.rows[0].elements[0].distance.value/1000); // distance in km
    const { duration } = result.rows[0].elements[0];
    return { distance, duration }; // distance in meters, duration in seconds
  } else {
    return null;
  };
};

// console.log(await geocode(['Barcelona']));
// console.log(await geocode(['Girona']));
// console.log(await geocode(['Tarragona']));

// import { getMunicipisFormatedDB, addMunicipiGeoDB } from './database/dbUtils.js';

// Get coordinates from all municipis
// Only needs to be called once to populate the database
// We can then export the data to a SQL migration file!
// async function retrieveMunicipisGeo() {
//   const municipiList = await getMunicipisFormatedDB();
//   for (const { municipiId, municipiInfo } of municipiList) {
//     const geocoded = await geocode(municipiInfo);
//     console.log(`(${municipiId}) ${municipiInfo} - ${geocoded.lat}, ${geocoded.lng}`);
//     await addMunicipiGeoDB(municipiId, geocoded.lat, geocoded.lng);
//     // Timer to avoid rate limit
//     await new Promise(resolve => setTimeout(resolve, 200));
//   };
// };