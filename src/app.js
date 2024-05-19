// import { addMunicipiGeoDB } from './lib/database/dbUtils.js';
import { computGlobal } from './lib/getRoutes.js';

const main = async () => {
  const data = await computGlobal();
  console.log(data);
}; 
await main();

// Acabem el programa
process.exit(0);
