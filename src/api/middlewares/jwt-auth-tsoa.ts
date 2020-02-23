import { Request } from 'express';
import { User } from '../../models/user';
import * as jwt from 'jsonwebtoken';
import config from '../../config';

export function expressAuthentication(request: Request,
    securityName: string,
    scopes?: string[],
): Promise<any> {
  if (securityName.toUpperCase() === 'JWT') {
    const accessToken = request.body.accessToken ||
      request.query.accessToken ||
      request.headers['x-access-token'];

    return new Promise((resolve, reject) => {
      if (!accessToken) {
        reject(new Error('Для доступа к ресурсу необходимо авторизоваться'));
      }

      jwt.verify(accessToken, config.jwt.access.secretKey, (err: any, decoded: any) => {
        if (err) {
          reject(err);
        } else {
          // // Check if JWT contains all required scopes
          // for (let scope of scopes) {
          //   if (!decoded.scopes.includes(scope)) {
          //     reject(new Error('JWT does not contain required scope'));
          //   }
          // }
          resolve(decoded);
        }
      });
    });
  } else {
    return new Promise((resolve, reject) => {
      reject(new Error(`Метод авторизации ${securityName} не реализован`));
    });
  }
}
