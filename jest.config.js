module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
    },
  },
  modulePathIgnorePatterns: ['test-utils'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/models/**/*.ts',
  ],
};
