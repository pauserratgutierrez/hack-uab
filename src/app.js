import { computGlobal } from './lib/getRoutes.js';

const main = async () => {
  return await computGlobal();
};

const result = await main();
console.log(result);
