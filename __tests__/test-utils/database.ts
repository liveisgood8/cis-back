import { getConnection } from 'typeorm';
import { unlinkSync } from 'fs';

export async function reloadDatabase(): Promise<void> {
  await getConnection().synchronize(true);
}

export async function closeConnection(): Promise<void> {
  const databaseName = getConnection().options.database;
  await getConnection().dropDatabase();
  await getConnection().close();
  unlinkSync(databaseName.toString());
}
