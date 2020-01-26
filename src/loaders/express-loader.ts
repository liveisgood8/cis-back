import express, { Request, Response, NextFunction, ErrorRequestHandler, Errback } from 'express';
import config from '../config';
import { IStatus } from '../core/interfaces/status';

export default () => {
  const app = express();
  const development = process.env.NODE_ENV !== 'production';

  if (development) {
    console.log('application started in development mode');
    app.get('/', (req: express.Request, res: express.Response) => {
      res.redirect('http://localhost:3000');
    });
  } else {
    app.use(express.static(config.staticPath));
  }

  app.use((req: Request, res: Response, next: NextFunction) => {
    const err: any = new Error('Указанного пути не существует');
    err['status'] = 404;
    next(err);
  });

  /** Main error handler */
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const status: IStatus = {
      error: err.message,
    };
    res.status(err.status || 500)
        .json(status);
  });

  app.listen(config.expressPort, () => {
    console.log('express listening on port', config.expressPort);
  });
};
