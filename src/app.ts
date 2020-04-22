import 'reflect-metadata';
import loaders from './loaders';
import config from './config';
import { User } from './models/user';
import { sign } from 'jsonwebtoken';

function getTestToken(): string {
  const jwtPayload = {
    user: {
      id: 1,
      login: 'l',
      password: 'p',
      imageUrl: 'i',
    } as User,
  };
  const accessToken = sign(jwtPayload, config.jwt.access.secretKey, {
    audience: config.jwt.audience,
    expiresIn: config.jwt.access.duration,
  });
  return accessToken.toString();
}

async function main(): Promise<void> {
  const app = await loaders();

  console.log('node env:', process.env.NODE_ENV);
  app.listen(config.expressPort, () => {
    console.log('api test token:', getTestToken());
    console.log('express listening on port', config.expressPort);
  });
}

main().catch(console.error);
