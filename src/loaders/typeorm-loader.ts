import { createConnection } from 'typeorm';

export const connectionName = process.env.NODE_ENV !== 'production' ?
  'dev-connection' : 'prod-connection';

export default async (): Promise<void> => {
  const connection = await createConnection(connectionName);
  process.on('exit', () => {
    connection.close();
  });
};

