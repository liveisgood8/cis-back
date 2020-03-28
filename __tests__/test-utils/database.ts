import { getConnection } from 'typeorm';

export async function reloadDatabase(): Promise<void> {
  await getConnection().synchronize(true);
}
