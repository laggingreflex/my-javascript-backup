#!/usr/bin/env node

const fs = require('mz/fs');
const Path = require('path');
const readdirpAsync = require('readdirp-async');
const mkdirp = require('mkdirp-promise');
const rimraf = require('rimraf-promise');
const debug = require('debug-any-level');
const _ = require('./utils');

// debug.enable('*');
debug.enable('main,info,error');

const root = 'C:/';

const includes = _.pathIncludes(`
C:/Apps/MPC
C:/red
C:/videos
C:/Users/x/Documents
`);
const excludes = _.pathMatches({
  startsWith: `
  `,
  includes: `
    node_modules
  `,
  endsWith: `
    .part
    // .mp4
  `,
});

const listAwait = _.getCtrAwaiter(1000 /* MAX_CONCURRENT_LIST */ );
const copyAwait = _.getCtrAwaiter(30 /* MAX_CONCURRENT_COPY */ );

debug.main('starting');
main().catch(console.error).then((() => debug.main('finished')));

async function main() {

  return readdirpAsync(root, async(error, item, stat, lstat) => {
    const log = new Proxy(debug, { get: (t, level) => (...msg) => debug[level](`${item} |>`, ...msg) });
    log.verbose('initializing');

    let shouldProcess;

    await listAwait(async() => {

      log.verbose('checking');
      if (error) {
        log.error(error.message);
        return;
      }

      shouldProcess = includes(item)
        && !excludes(item);

      if (!shouldProcess) {
        log.verbose('Not processing');
        return;
      } else {
        log.verbose('processing');

      }
      if (!stat.isFile()) {
        log.verbose('Not a file');
        return;
      }

      const src = item;
      const dest = src.replace(/^C:/, 'B:');

      let destStat;
      try {
        destStat = await fs.stat(dest);
      } catch (error) {
        log.verbose('dest does not exist, creating');
        // await mkdirp(Path.dirname(dest));
      }

      if (lstat.isSymbolicLink()) {
        log.verbose('SymbolicLink');
        const realpath = await fs.realpath(src);
        try {
          await fs.access(realpath);
        } catch (error) {
          log.verbose('orphan SymbolicLink');
        }
        return;
      }

      log.verbose('copying');

      if (destStat) {
        if (!(stat.mtime - destStat.mtime)) {
          log.verbose('same mtime', destStat.mtime);
          return;
        } else {
          log.verbose('mtime diff', stat.mtime - destStat.mtime);
        }
      }

      await copyAwait(async() => {

        log.verbose('copying');
        await mkdirp(Path.dirname(dest));
        await rimraf(dest);
        await fs.copyFile(src, dest);
        log.verbose('copied');


        if (_.pathIncludes(`
            C:/red
            C:/videos
          `)(src) || _.pathMatches({
            includes: `/.old/`,
          })(src)) {
          log.verbose('linking');
          await rimraf(src);
          await fs.symlink(dest, src);
          log.verbose('linked');
          log.info('copied & linked');
        } else {
          log.info('copied');
        }

      }).catch(log.error);

    }).catch(log.error);

    return shouldProcess;

  });
}
