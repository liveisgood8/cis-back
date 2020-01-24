const tsConfig = require('./tsconfig.json');
const tsConfigPaths = require('tsconfig-paths');
const path = require('path');

tsConfigPaths.register({
  baseUrl: path.resolve(tsConfig.compilerOptions.outDir || '', tsConfig.compilerOptions.baseUrl || ''),
  paths: tsConfig.compilerOptions.paths,
});
