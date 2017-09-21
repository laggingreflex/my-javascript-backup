#!/usr/bin/env node

// const fs = require('./utils/fs');
const fs = require('mz/fs');
const Path = require('path');
const readdirpAsync = require('readdirp-async');
const mkdirp = require('mkdirp-promise');
const rimraf = require('rimraf-promise');
const _ = require('./utils');
const exclude = require('./exclude');

const root = 'C:/';

main().catch(console.error).then((() => console.log('done')));

async function main() {

  let ctr = 0;
  return readdirpAsync(root, async(error, item, stat, lstat) => {
    const log = (...msg) => console.log(item, ...msg);
    log.error = (...msg) => console.error('[error]', item, ...msg);
    // log('initializing');
    while (ctr > 100) {
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

      shouldProcess = !exclude(item);

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

      log('copying');

      if (destStat) {
        if (!(stat.mtime - destStat.mtime)) {
          // log('same mtime', destStat.mtime);
          return;
        } else {
          // log('mtime diff', stat.mtime - destStat.mtime);
        }
      }

      // log('copying');
      // await mkdirp(Path.dirname(dest));
      // await rimraf(dest);
      // await fs.copyFile(src, dest);
      log('copied');



      // if (_.match(src, {
      //     startsWith: [
      //       'C:/Apps',
      //       'C:/Data',
      //       'C:/Games',
      //       'C:/Music',
      //       'C:/Pictures',
      //       'C:/Softwares',
      //       'C:/Torrents',
      //     ],
      //   })) {
      //   log('copying');
      //   // await fs.copyFile(src, dest);
      // }



    })().catch(error => console.error('error', error.message));
    ctr--;
    return shouldProcess;
  });

  // readdirp({
  //   root,
  //   fileFilter: [''],
  //   directoryFilter: [''],
  // })
  // // .on('readable', onReadable)
  // // .on('error', onError)
  // // .on('end', onEnd);

  function filter(file) {
    // const basename = Path.basename(file)
    // return basename === '.' || basename[0] !== '.'
    return true;
    return _.match(file, {
      startsWith: [
        'C:/Windows',
        'C:/Program Files',
        'C:/Python27',
      ],
      includes: [
        'Recycle.Bin',
        'node_modules',
      ],
      endsWith: [
        '.log',
      ],
    });
  }

  async function onReadable() {
    let item
    while ((item = this.read())) {
      // do something with the file
      console.log('onRead:', item.path);
    }
  }

  function onError(error, item) {
    console.error('onError:', error.message);
    console.error('onError:', item.path);
  }

  function onEnd(error, item) {
    if (error) {
      console.error('onEnd error:', error.message);
      console.error('onEnd error:', item.path);
    }
    console.log('Done');
  }

  // const files = await readdir(startDir, [(file, stats) => {
  //   const dest = file.replace(/^C:/, 'B:');
  //   if (_.match(file, {
  //       startsWith: [
  //         'C:/Apps',
  //         'C:/Data',
  //         'C:/Games',
  //         'C:/Music',
  //         'C:/Pictures',
  //         'C:/Softwares',
  //         'C:/Torrents',
  //       ]
  //     })) {
  //     await mkdirp(Path.dirname(dest));
  //   } else if (false) {}

  //   if (!file.match(new RegExp('^(' + [
  //       // include
  //       ...[
  //         // starts with:
  //         'C:/Apps',
  //         'C:/Data',
  //         'C:/Games',
  //         'C:/Music',
  //         'C:/Pictures',
  //         'C:/Softwares',
  //         'C:/Torrents',
  //       ].map(_ => `${_}.*`),
  //       ...[
  //         // contains:
  //         // 'Recycle.Bin',
  //         // 'node_modules',
  //       ].map(_ => `.*${_}.*`),
  //       ...[
  //         // ends with:
  //         // '.log',
  //       ].map(_ => `.*${_}`),
  //     ].join('|') + ')$', 'i'))) {
  //     console.log(`ignored:`, file);
  //     return true;
  //   } else if (file.match(new RegExp('^(' + [
  //       // exclude
  //       ...[
  //         // starts with:
  //         'C:/Windows',
  //         'C:/Program Files',
  //         'C:/Python27',
  //       ].map(_ => `${_}.*`),
  //       ...[
  //         // contains:
  //         'Recycle.Bin',
  //         'node_modules',
  //       ].map(_ => `.*${_}.*`),
  //       ...[
  //         // ends with:
  //         '.log',
  //       ].map(_ => `.*${_}`),
  //     ].join('|') + ')$', 'i'))) {
  //     console.log(`ignored:`, file);
  //     return true;
  //   } else {
  //     console.log(`added:`, file);
  //     return false;
  //   }
  // }]);

}
