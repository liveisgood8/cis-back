import expressLoader from './express-loader';
import typeormLoader from './typeorm-loader';
import diLoader from './di-loader';
import express from 'express';

export default async (): Promise<express.Express> => {
  const app = expressLoader();

  await typeormLoader();
  await diLoader();

  return app;
};
