const Path = require('path');
const fs = require('mz/fs');

const _ = exports;

const parseTemplateString = _ => _.split(/[\r\n]+/)
  .map(_ => _.trim())
  .filter(Boolean)
  .filter(_ => !_.startsWith('//'));

const parseIncludes = _ => parseTemplateString(_)
  .map(Path.normalize);

const normalize = _ => _.replace(/[/\\]+/g, '[/\\\\]+').replace(/\$/, '\\$');

_.pathIncludes = includes => item => parseIncludes(includes).some(i => item.toLowerCase().includes(i.toLowerCase()) || i.toLowerCase().includes(item.toLowerCase()))

// _.pathMatches = (str, { startsWith = [], includes = [], endsWith = [] } = {}) => str.match(new RegExp('^(' + [
//   ...startsWith.map(_ => `${normalize(_)}.*`),
//   ...includes.map(_ => `.*${normalize(_)}.*`),
//   ...endsWith.map(_ => `.*${normalize(_)}`),
// ].join('|') + ')$', 'i'));

_.pathMatches = ({ startsWith = '', includes = '', endsWith = '' } = {}) => {
  const regex = new RegExp('^(' + [
    ...parseTemplateString(startsWith).map(_ => `${normalize(_)}.*`),
    ...parseTemplateString(includes).map(_ => `.*${normalize(_)}.*`),
    ...parseTemplateString(endsWith).map(_ => `.*${normalize(_)}`),
  ].join('|') + ')$', 'i');
  // console.log(`regex:`, regex);
  return item => item.match(regex);
};


_.getCtrAwaiter = max => {
  let ctr = 0;
  return async fn => {
    while (ctr >= max) {
      // console.log('awaiting', { ctr });
      await new Promise(_ => setTimeout(_, 1000));
    }
    ctr++;
    try {
      const result = await fn();
      ctr--;
      return result;
    } catch (error) {
      ctr--;
      throw error;
    }
  }
}
