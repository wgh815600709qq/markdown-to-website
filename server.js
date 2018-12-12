// 服务
const express = require('express');
const app = express();
const path = require('path');
const opn = require('opn');
app.use(express.static('dist'));
app.get('/', (req, res, next) => {
    res.sendFile(path.resolve(__dirname, './dist/index.html'))
})

app.listen(8111)
console.log('8111 is on server.')
opn('http://localhost:8111', { app: 'chrome' });