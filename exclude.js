const Path = require('path');
const _ = require('./utils');

const parse = _ => _.split(/[\r\n]+/)
  .map(_ => _.trim())
  .filter(Boolean)
  .filter(_ => !_.startsWith('//'))
  .map(Path.normalize);

const exclude = parse(`
C:/$
C:/xampp
C:/.Trash
C:/AMD
// C:/Apps
C:/Data
C:/Games
C:/Go
C:/home
C:/localhost
C:/MinGW
C:/msys64
C:/Music
C:/old
C:/PerfLogs
C:/Pictures
// C:/Program Files
// C:/Program Files (x86)
C:/Program
C:/Python27
// C:/red
C:/Softwares
C:/Synthesia
C:/temp
C:/Torrents
C:/Users
// C:/Videos
C:/Windows
`);

const includes = parse(`
C:/Apps/MPC
// C:/red
`);

module.exports = item => {
  // if (exclude.some(_ => item.startsWith(_))) {
  // if (exclude.some(_ => item.length >= _.length && item.startsWith(_))) {
  //   return true
  // }

  // if (include.some(_ => item.length >= _.length && !item.startsWith(_))) {
  //   return true
  // }

  // const some = includes.some(i => {
  //   // console.log(`[item: '${item}'].includes([i: '${i}']):`, item.includes(i));
  //   // console.log(`[i: '${i}'].includes([item: '${item}']):`, i.includes(item));
  //   return item.includes(i) || i.includes(item);
  // });
  // // console.log('some', some);
  // if (!some) {
  //   return true
  //   // return false
  // }

  if (!includes.some(i => item.includes(i) || i.includes(item))) {
    return true
  }

  // if (_.match(item, {
  //     startsWith: [
  //       'C:/$',
  //       'C:/Windows',
  //       'C:/Go',
  //       'C:/.Trash',
  //       'C:/Program Files',
  //       'C:/Python27',

  //       'C:/xampp',
  //       'C:/.Trash-1000',
  //       'C:/AMD',
  //       // 'C:/Apps',
  //       'C:/Data',
  //       'C:/Games',
  //       'C:/home',
  //       'C:/localhost',
  //       'C:/MinGW',
  //       'C:/msys64',
  //       'C:/Music',
  //       'C:/old',
  //       'C:/PerfLogs',
  //       'C:/Pictures',
  //       'C:/Program Files',
  //       'C:/Program Files (x86)',
  //       'C:/Python27',
  //       'C:/Softwares',
  //       'C:/Synthesia',
  //       'C:/temp',
  //       'C:/Torrents',
  //       'C:/Users',
  //       'C:/Videos',
  //       'C:/Windows',

  //     ],
  //     includes: [
  //       'Recycle.Bin',
  //       'node_modules',
  //       'cache',
  //     ],
  //     endsWith: [
  //       '.log',
  //     ],
  //   })) return true;

  // // if (!_.match(item, {
  // //     startsWith: [
  // //       'C:',
  // //       // 'C:/Apps',
  // //       'C:/Apps/MPC',
  // //       // 'C:/Videos',
  // //       // 'C:/Torrents/Completed',
  // //       // 'C:/Users/x',
  // //     ],
  // //   })) return true;

  // // if (_.match(item, {
  // //     startsWith: [
  // //       'C:/Users/.*/AppData',
  // //     ],
  // //   })) {
  // //   if (_.match(item, {
  // //       includes: [
  // //         '',
  // //       ],
  // //     })) {

  // //     }
  // // }


}
