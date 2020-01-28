import { createConnection } from 'typeorm';

export default async (): Promise<void> => {
  const connection = await createConnection();
  process.on('exit', () => {
    connection.close();
  });
};

