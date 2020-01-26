import { createConnection } from 'typeorm';

export default async () => {
  const connection = await createConnection();
  process.on('exit', () => {
    connection.close();
  });
};

