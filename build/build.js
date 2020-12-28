// 服务
const express = require('express');
const app = express();
const path = require('path');
const opn = require('opn');
const webpackConfig = require('./webpack.config');
const webpack = require('webpack');
const webpackHotMiddleWare = require('webpack-hot-middleware');
const webpackDevMiddleWare = require('webpack-dev-middleware');
const compiler = webpack(webpackConfig);
const devMiddleWare = webpackDevMiddleWare(compiler, {
    publicPath: webpackConfig.output.publicPath
});
const hotMiddleWare = webpackHotMiddleWare(compiler, {
    heartbeat: 2000
});
app.use(devMiddleWare);
app.use(hotMiddleWare);
app.use(express.static('dist'));
app.get('/', (req, res, next) => {
    res.sendFile(path.resolve(__dirname, './dist/index.html'))
})

let inited = false;
app.listen(8111, () => {
    console.log('8111 is on server.')
    if (!inited) {
        opn('http://localhost:8111', { app: 'chrome' });
        inited = true;
    }
})