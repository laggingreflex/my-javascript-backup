#!/usr/bin/env node

const fs = require('mz/fs');
const Path = require('path');
const readdirpAsync = require('readdirp-async');
const mkdirp = require('mkdirp-promise');
const rimraf = require('rimraf-promise');
const _ = require('./utils');
const exclude = require('./exclude');

const root = 'C:/';
const MAX_CONCURRENT = 1;

const includes = _.pathIncludes(`
C:/Apps/MPC
C:/red
`);
const excludes = !_.pathIncludes(`
.part
`);

main().catch(console.error).then((() => console.log('done')));

async function main() {
  let ctr = 0;
  return readdirpAsync(root, async(error, item, stat, lstat) => {
    const log = (...msg) => console.log(item, ...msg);
    log.error = (...msg) => console.error('[error]', item, ...msg);
    // log('initializing');
    while (ctr >= MAX_CONCURRENT) {
      // log('awaiting', { ctr });
      await new Promise(_ => setTimeout(_, 1000));
    }
    ctr++;
    let shouldProcess;
    await (async() => {
      // log('checking');
      if (error) {
        log.error(error.message);
        return;
      }

      shouldProcess = includes(item);

      if (!shouldProcess) {
        // log('Not processing');
        return;
      } else {
        // log('processing');

      }
      if (!stat.isFile()) {
        // log('Not a file');
        return;
      }
      if (lstat.isSymbolicLink()) {
        // log('Not a file');
        return;
      }

      const src = item;
      const dest = src.replace(/^C:/, 'B:');
      let destStat;
      try {
        destStat = await fs.stat(dest);
      } catch (error) {
        // log('dest does not exist, creating');
        // await mkdirp(Path.dirname(dest));
      }

      // log('copying');

      if (destStat) {
        if (!(stat.mtime - destStat.mtime)) {
          // log('same mtime', destStat.mtime);
          return;
        } else {
          // log('mtime diff', stat.mtime - destStat.mtime);
        }
      }

      log('copying');
      await mkdirp(Path.dirname(dest));
      await rimraf(dest);
      await fs.copyFile(src, dest);
      log('copied');


      if (_.pathIncludes(`
        C:/red
      `)(src)) {
        log('linking');
        await rimraf(src);
        await fs.symlink(dest, src);
        log('linked');
      }


    })().catch(error => console.error('error', error.message));
    ctr--;
    return shouldProcess;
  });



}
