// 服务
const express = require('express');
const app = express();
const path = require('path');
const opn = require('opn');
const webpackConfig = require('./webpack.config');
const webpack = require('webpack');
const webpackHotMiddleWare = require('webpack-hot-middleware');
const webpackDevMiddleWare = require('webpack-dev-middleware');
const compressing = require("compressing");
const compiler = webpack(webpackConfig);
const chalk = require('chalk');
const fs = require('fs');
const devMiddleWare = webpackDevMiddleWare(compiler, {
    publicPath: webpackConfig.output.publicPath
});
const hotMiddleWare = webpackHotMiddleWare(compiler, {
    heartbeat: 2000
});
const resolve = dir => path.join(__dirname, "..", dir);
app.use(devMiddleWare);
app.use(hotMiddleWare);
app.use(express.static('dist'));
app.get('/', (req, res, next) => {
    res.sendFile(path.resolve(__dirname, './dist/index.html'))
})
app.use(express.static(resolve('/serverStatic')));
app.get('/exports', (req, res, next) => {
    const downloadPath = path.resolve(__dirname, 'resource.zip');
    if (fs.existsSync(downloadPath)) {
        console.log(chalk.yellow('下载文件已存在'))
        res.download(downloadPath);
    } else {
        compressing.zip
        .compressDir(resolve("/resource"), path.resolve(__dirname, 'resource.zip'))
        .then(() => {
            console.log(chalk.yellow(`[√]文件压缩成功.`));
            res.setContentType("application/octet-stream")
            res.download(path.resolve(__dirname, 'resource.zip'));
        })
        .catch(err => {
            console.log(chalk.red("[×]压缩报错"));
            console.error(err);
        });
    }
})

let inited = false;
app.listen(8111, () => {
    console.log('8111 is on server.')
    if (!inited) {
        // opn('http://localhost:8111', { app: 'chrome' });
        inited = true;
    }
})