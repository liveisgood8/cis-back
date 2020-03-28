import express from 'express';
import expressLoader from '../../src/loaders/express-loader';
import passportLoader from '../../src/loaders/passport-loader';
import diLoader from '../../src/loaders/di-loader';
import { createConnection } from 'typeorm';
import { Task } from '../../src/models/task';
import { User } from '../../src/models/user';
import { Client } from '../../src/models/client';
import { Contract } from '../../src/models/contract';
import { UserPermissions } from '../../src/models/permissions';
import { BusinessRequest } from '../../src/models/request';

export async function testLoader(): Promise<express.Express> {
  // Test type orm instance
  const connection = await createConnection({
    type: 'sqlite',
    database: 'database/test.sqlite',
    entities: [
      User,
      Task,
      Client,
      Contract,
      UserPermissions,
      BusinessRequest,
    ],
    dropSchema: true,
    synchronize: true,
  });
  process.on('exit', () => {
    connection.close();
  });

  await diLoader();

  passportLoader();
  const app = expressLoader();

  return app;
}
