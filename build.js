const fs = require('fs');
const path = require('path');

const template = fs.readFileSync(path.join(__dirname, 'scripts', 'env.js'), 'utf-8');

const output = template
  .replace('__PROJECT_ID__', process.env.PROJECT_ID)
  .replace('__ENDPOINT__', process.env.ENDPOINT)
  .replace('__BUCKET__', process.env.BUCKET);

fs.writeFileSync(path.join(__dirname, 'scripts', 'env.js'), output);

console.log('env.js was created!');