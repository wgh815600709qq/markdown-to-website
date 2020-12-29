const {analysis, merge } = require('../build/util');
const path = require('path');
// const result = analysis(path.resolve(__dirname, '../build/decompress'));
// console.log('result', result);
// console.log(result.filter(it => it.type === 'file').every(it => it.name.endsWith('.md')));
merge();