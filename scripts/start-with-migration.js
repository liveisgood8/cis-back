const { execSync } = require('child_process');
const { connectionName } = require('../dist/src/loaders/typeorm-loader');

const schemaSync = execSync(`npx typeorm schema:sync -c ${connectionName}`);
console.log('sync schema result', schemaSync.toString());

const migration = execSync(`npx typeorm migration:run -c ${connectionName}`);
console.log('migration result', migration.toString());

require('../dist/src/app');
