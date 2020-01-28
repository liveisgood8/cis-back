export default {
  expressPort: 8080,
  staticPath: './public',
  passwordSalt: 'password_salt',
  jwt: {
    secretKey: 'jwt_secret_key',
    audience: 'www.cis.com',
  },
};
