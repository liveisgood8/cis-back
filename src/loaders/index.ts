import expressLoader from './express-loader';
import typeormLoader from './typeorm-loader';
import diLoader from './di-loader';
import passportLoader from './passport-loader';

export default async (): Promise<void> => {
  const typeormPromise = typeormLoader();
  passportLoader();
  expressLoader();

  await typeormPromise;
  await diLoader();
};
