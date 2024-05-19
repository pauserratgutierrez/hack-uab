import { addMunicipiGeoDB } from './lib/database/dbUtils.js';
import { computGlobal } from './lib/getRoutes.js';

const main = async () => {
  return await computGlobal();
};

const result = await main();

// Acabem el programa
process.exit(0);
