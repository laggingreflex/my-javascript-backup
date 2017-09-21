#!/usr/bin/env node

const fs = require('mz/fs');
const Path = require('path');
const readdirpAsync = require('readdirp-async');
const mkdirp = require('mkdirp-promise');
const rimraf = require('rimraf-promise');
const _ = require('./utils');
const exclude = require('./exclude');

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

main().catch(console.error).then((() => console.log('done')));

async function main() {

  return readdirpAsync(root, async(error, item, stat, lstat) => {
    const log = (...msg) => console.log(`${item} |>`, ...msg);
    log.error = (...msg) => console.error('[error]', `${item} |>`, ...(msg[0] && msg[0].message && [msg[0].message] || msg));
    // log('initializing');

    let shouldProcess;

    await listAwait(async() => {

      // log('checking');
      if (error) {
        log.error(error.message);
        return;
      }

      shouldProcess = includes(item)
        && !excludes(item);

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

      const src = item;
      const dest = src.replace(/^C:/, 'B:');

      let destStat;
      try {
        destStat = await fs.stat(dest);
      } catch (error) {
        // log('dest does not exist, creating');
        // await mkdirp(Path.dirname(dest));
      }

      if (lstat.isSymbolicLink()) {
        // log('SymbolicLink');
        const realpath = await fs.realpath(src);
        try {
          await fs.access(realpath);
        } catch (error) {
          log('orphan SymbolicLink');
        }
        return;
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

      await copyAwait(async() => {

        // log('copying');
        await mkdirp(Path.dirname(dest));
        await rimraf(dest);
        await fs.copyFile(src, dest);
        log('copied');


        if (_.pathIncludes(`
            C:/red
            C:/videos
          `)(src) || _.pathMatches({
            includes: `/.old/`,
          })(src)) {
          // log('linking');
          await rimraf(src);
          await fs.symlink(dest, src);
          log('linked');
        }

        // if (_.pathIncludes(`
        //     C:/Users/x/Documents
        //     `)(src) && _.pathMatches({
        //     includes: `/.old/`,
        //   })(src)) {
        //   log('symlinking .old');
        //   await rimraf(src);
        //   await fs.symlink(dest, src);
        //   log('removed .old');
        //   // log('linked');
        // }

      }).catch(log.error);

    }).catch(log.error);

    return shouldProcess;

  });
}
