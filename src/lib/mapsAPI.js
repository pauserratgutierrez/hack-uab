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
export async function getMatrix(origins, destinations) {
  const response = await client.distancematrix({
    params: {
      origins,
      destinations,
      key: process.env.GOOGLE_MAPS_API_KEY,
    },
  });

  const result = response.data;
  if (result.status === 'OK') {
    const distance = parseFloat(result.rows[0].elements[0].distance)/1000; // distance in km
    const { duration } = result.rows[0].elements[0];
    return { distance, duration }; // distance in meters, duration in seconds
  } else {
    return null;
  };
};
