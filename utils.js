const Path = require('path');
const fs = require('mz/fs');
const pAll = require('p-all');

const _ = exports;
const __ = _;

// _.normalize = _ => _.replace(/[/\\]+/g, '[/\\\\]+').replace(/\$/, '\\$');
// _.normalize = _ => _.replace(/[/\\]+/g, '[/\\\\]+').replace(/\$/, '\\$');

_.match = (str, { startsWith = [], includes = [], endsWith = [] } = {}) => {
  const regex = new RegExp('^(' + [
    ...startsWith.map(_ => `${__.normalize(_)}.*`),
    ...includes.map(_ => `.*${__.normalize(_)}.*`),
    ...endsWith.map(_ => `.*${__.normalize(_)}`),
  ].join('|') + ')$', 'i');
  // console.log({ regex });
  // process.exit()
  return str.match(regex)
}


_.readdir = async(item, opts = {}, cb) => {
  try {
    const [stat, lstat] = Promise.all([
      fs.stat(dir),
      fs.lstat(dir),
    ]);
    if (await cb(item, stat, lstat)) {

    } else {

    }

  } catch (error) {

  }
}
