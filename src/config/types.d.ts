export interface IConfig {
  expressPort: number;
  staticPath: string;
  passwordSalt: string;
  jwt: {
    audience: string;
    access: {
      secretKey: string;
      duration: string | number;
    };
    refresh: {
      secretKey: string;
      duration: string | number;
    };
  };
}
