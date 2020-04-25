module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
    },
  },
  modulePathIgnorePatterns: ['test-utils'],
  testPathIgnorePatterns: ['/deps/'],
  testTimeout: 10000,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/app.ts',
    '!src/models/**/*.ts',
    '!src/api/routes.ts',
    '!src/config/**.ts',
    '!src/api/middlewares/jwt-auth-tsoa.ts',
    '!src/loaders/**/*.ts',
  ],
};
