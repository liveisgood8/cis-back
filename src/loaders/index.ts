import expressLoader from './express-loader';
import typeormLoader from './typeorm-loader';
import diLoader from './di-loader';
import passportLoader from './passport-loader';
import express from 'express';

export default async (): Promise<express.Express> => {
  const typeormPromise = typeormLoader();
  passportLoader();
  const app = expressLoader();

  await typeormPromise;
  await diLoader();

  return app;
};
