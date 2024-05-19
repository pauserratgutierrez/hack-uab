import { computGlobal } from './lib/getRoutes.js';

const main = async () => {
  return await computGlobal();
};

const result = await main();
for(let i = 0; i < result.length; i++) {
  console.log(result[i]);
}
