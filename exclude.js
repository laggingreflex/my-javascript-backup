const Path = require('path');
const _ = require('./utils');

const parse = _ => _.split(/[\r\n]+/)
  .map(_ => _.trim())
  .filter(Boolean)
  .filter(_ => !_.startsWith('//'))
  .map(Path.normalize);

const includes = parse(`
C:/Apps/MPC
C:/red
`);

module.exports = item => {
  if (!includes.some(i => item.includes(i) || i.includes(item))) {
    return true
  }
}
