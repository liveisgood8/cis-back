import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import swaggerConfig from '../../swagger.json';
import tsoaConfig from '../../tsoa.json';
import config from '../config';
import { RegisterRoutes } from '../api/routes';
import { getPureError } from '../utils/error-stringify';
import { ValidateError, FieldErrors } from 'tsoa';
import { IError } from '../core/types.js';
import { Errors } from '../utils/errors.js';
import { CodeError } from '../utils/error-with-code.js';

export default (): void => {
  const app = express();
  const development = process.env.NODE_ENV !== 'production';

  app.use(bodyParser.json());

  if (development) {
    console.log('application started in development mode');
    app.use(cors());
    app.get('/', (req: Request, res: Response) => {
      res.redirect('http://localhost:3000');
    });
  } else {
    app.use(express.static(config.staticPath));
  }

  app.use(passport.initialize());
  RegisterRoutes(app);
  app.use(tsoaConfig.swagger.basePath + '/docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig));

  /* eslint-disable @typescript-eslint/no-unused-vars */
  /* eslint-disable @typescript-eslint/no-explicit-any */
  app.use((req: Request, res: Response, next: NextFunction) => {
    const err: any = new CodeError(Errors.PATH_NOT_FOUND);
    err['status'] = 404;
    next(err);
  });

  /** Main error handler */
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const error: IError = {
      code: err.code || Errors.UNKNOWN_ERROR,
    };
    if (err instanceof ValidateError) {
      error.code = Errors.REQUEST_VALIDATE_ERROR;
      error.message = Object.values(err.fields).map((e) => `${e.message}, но получено '${e.value}'`).join('\n');
    } else {
      error.message = err.message;
    }
    res.status(err.status || 500);
    res.json(error);
  });

  /* eslint-enable @typescript-eslint/no-unused-vars */
  /* eslint-enable @typescript-eslint/no-explicit-any */

  app.listen(config.expressPort, () => {
    console.log('express listening on port', config.expressPort);
  });
};
