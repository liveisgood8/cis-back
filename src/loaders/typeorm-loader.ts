import { createConnection } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';

function getConnectionOption(): PostgresConnectionOptions | SqliteConnectionOptions {
  if (process.env.NODE_ENV !== 'production') {
    return {
      type: 'sqlite',
      database: 'database/db.sqlite',
      entities: ['dist/src/models/**/*.js'],
      synchronize: true,
      logging: true,
    };
  } else {
    return {
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'qcrm-db-user',
      password: 'db-password',
      database: 'qcrm',
      synchronize: true,
      logging: true,
      entities: ['dist/src/models/**/*.js'],
    };
  }
}

export default async (): Promise<void> => {
  const connection = await createConnection(getConnectionOption());
  process.on('exit', () => {
    connection.close();
  });
};

