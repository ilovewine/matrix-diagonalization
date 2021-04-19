const fs = require('fs');
const os = require('os');
const QRDiagonalization = require('./src/QRDiagonalization');
const JacobiDiagonalization = require('./src/JacobiDiagonalization');

function getFlagValue(flag) {
  const arguments = process.argv.slice(2);
  return arguments.filter(arg => arg.includes(`--${flag}`))[0].replace(`--${flag}=`, '');
}

const filePath = getFlagValue('file');
const method = getFlagValue('method');

let contents = fs.readFileSync(filePath).toString().split(os.EOL);
contents.shift();
contents = contents.map(row =>
  row
    .split(' ')
    .filter(el => el.length)
    .map(el => +el)
);

let solution;
switch (method) {
  case 'qr':
    solution = new QRDiagonalization(contents);
    break;
  case 'jacobi':
    solution = new JacobiDiagonalization(contents);
    break;
  default:
    throw new Error('Wrong method input');
}
solution.solve();
