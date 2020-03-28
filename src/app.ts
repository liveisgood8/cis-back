import 'reflect-metadata';
import loaders from './loaders';
import config from './config';

async function main(): Promise<void> {
  const app = await loaders();

  app.listen(config.expressPort, () => {
    console.log('express listening on port', config.expressPort);
  });
}

main().catch(console.error);
