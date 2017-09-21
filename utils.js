const Path = require('path');
const fs = require('mz/fs');
const pAll = require('p-all');

const _ = exports;

const parseIncludes = _ => _.split(/[\r\n]+/)
  .map(_ => _.trim())
  .filter(Boolean)
  .filter(_ => !_.startsWith('//'))
  .map(Path.normalize);

// const includes = parse(`
// C:/Apps/MPC
// C:/red
// `);


_.pathIncludes = includes => item => parseIncludes(includes).some(i => item.includes(i) || i.includes(item))
