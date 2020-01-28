import express, { Request, Response, NextFunction } from 'express';
import config from '../config';
import { IStatus } from '../core/interfaces/status';

export default (): void => {
  const app = express();
  const development = process.env.NODE_ENV !== 'production';

  if (development) {
    console.log('application started in development mode');
    app.get('/', (req: Request, res: Response) => {
      res.redirect('http://localhost:3000');
    });
  } else {
    app.use(express.static(config.staticPath));
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  /* eslint-disable @typescript-eslint/no-explicit-any */
  app.use((req: Request, res: Response, next: NextFunction) => {
    const err: any = new Error('Указанного пути не существует');
    err['status'] = 404;
    next(err);
  });

  /** Main error handler */
  app.use((err: Record<string, any>, req: Request, res: Response, next: NextFunction) => {
    const status: IStatus = {
      error: err.message,
    };
    res.status(err.status || 500)
        .json(status);
  });

  /* eslint-enable @typescript-eslint/no-unused-vars */
  /* eslint-enable @typescript-eslint/no-explicit-any */

  app.listen(config.expressPort, () => {
    console.log('express listening on port', config.expressPort);
  });
};
