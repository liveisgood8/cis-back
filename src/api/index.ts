import { Router } from 'express';
import auth from './routes/auth';
import user from './routes/user';

export default (): Router => {
  const router = Router();

  auth(router);
  user(router);

  return router;
};
