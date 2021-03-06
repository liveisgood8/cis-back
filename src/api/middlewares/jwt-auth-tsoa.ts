import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import config from '../../config';

function getToken(req: Request): string | null {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    return req.query.token;
  }
  return null;
}

export function expressAuthentication(request: Request,
  securityName: string,
  scopes?: string[],
): Promise<any> {
  if (securityName.toUpperCase() === 'JWT') {
    const accessToken = getToken(request);

    return new Promise((resolve, reject) => {
      if (!accessToken) {
        reject(new Error('Для доступа к ресурсу необходимо пройти аутентификацию'));
      }

      jwt.verify(accessToken, config.jwt.access.secretKey, (err: any, decoded: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded.user);
        }
      });
    });
  } else {
    return new Promise((resolve, reject) => {
      reject(new Error(`Метод авторизации ${securityName} не реализован`));
    });
  }
}
