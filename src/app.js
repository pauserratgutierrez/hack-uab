import { computGlobal } from './lib/getRoutes.js';

const main = async () => {
  await computGlobal();
};

main().then(console.log(result));
