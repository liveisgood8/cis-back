import expressLoader from './express-loader';
import typeormLoader from './typeorm-loader';
import diLoader from './di-loader';
import passportLoader from './passport-loader';
import express from 'express';

export default async (): Promise<express.Express> => {
  passportLoader();
  const app = expressLoader();

  await typeormLoader();
  await diLoader();

  return app;
};
