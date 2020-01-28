import expressLoader from './express-loader';
import typeormLoader from './typeorm-loader';
import diLoader from './di-loader';

export default async (): Promise<void> => {
  const typeormPromise = typeormLoader();
  expressLoader();

  await typeormPromise;
  await diLoader();
};
