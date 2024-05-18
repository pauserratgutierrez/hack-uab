import { Client } from '@googlemaps/google-maps-services-js';

const client = new Client({});

// Geocoding
// export async function geocode(address) {
//   const response = await client.geocode({
//     params: {
//       address,
//       key: process.env.GOOGLE_MAPS_API_KEY,
//     },
//   });

//   return response.data.results[0].geometry.location;
// };

// await geocode('Barcelona').then(response => { console.log(response) });

// Calculate distance between two addresses
export async function distanceMatrix(origins, destinations) {
  const response = await client.distancematrix({
    params: {
      origins,
      destinations,
      key: process.env.GOOGLE_MAPS_API_KEY,
    },
  });

  return response.data;
};

const origins = ['Breda', 'Madrid'];
const destinations = ['Valencia', 'Sevilla'];

(async () => {
  const response = await distanceMatrix(origins, destinations);
  const rows = response.rows;

  rows.forEach((row, i) => {
    row.elements.forEach((element, j) => {
      console.log(`${origins[i]} -> ${destinations[j]}: Distance: ${element.distance.text}, Duration: ${element.duration.text}`);
    });
  });
})();