import { getConnection } from 'typeorm';
import { unlinkSync } from 'fs';
import { connectionName } from '../../src/loaders/typeorm-loader';

export async function reloadDatabase(): Promise<void> {
  await getConnection(connectionName).synchronize(true);
}

export async function closeConnection(): Promise<void> {
  const connection = getConnection(connectionName);
  const databaseName = connection.options.database;
  await connection.dropDatabase();
  await connection.close();
  unlinkSync(databaseName.toString());
}
