const fs = require('fs');
const path = require('path');

const pkg = require(path.join(__dirname, '../package.json'));
const versionFile = path.join(__dirname, '../public/VERSION');

fs.writeFileSync(versionFile, pkg.version, 'utf8');
console.log(`VERSION file updated to: ${pkg.version}`); 