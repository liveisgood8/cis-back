import express from 'express';
import config from '../config';

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

  app.listen(config.expressPort, () => {
    console.log('express listening on port', config.expressPort);
  });
};
