import { config as devConfig } from './dev';
import { config as prodConfig } from './dev';
import { IConfig } from './types';

let config: IConfig;
if (process.env.NODE_ENV !== 'production') {
  config = devConfig;
} else {
  config = prodConfig;
}

export default config;