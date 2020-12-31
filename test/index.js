const { analysis, merge, anasyResource } = require('../build/util');
const path = require('path');
const fs = require('fs');
// const result = analysis(path.resolve(__dirname, '../build/decompress'));
// console.log('result', result);
// console.log(result.filter(it => it.type === 'file').every(it => it.name.endsWith('.md')));
// merge();
// fs.renameSync(path.resolve(__dirname, '../build/decompress/imports_123'), path.resolve(__dirname, '../build/decompress/imports'))

// const p = `D:/markdown-to-website/build/upload/upload_0dee2da3b7538af8acc09967852da5ed.zip`;
// console.log(path.resolve(p));
const result = anasyResource()
console.log(JSON.stringify(result));