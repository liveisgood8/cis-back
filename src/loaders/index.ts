import expressLoader from './express-loader';
import typeormLoader from './typeorm-loader';

export default async (): Promise<void> => {
  const typeormPromise = typeormLoader();
  expressLoader();

  await typeormPromise;
};
