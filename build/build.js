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
const formidable = require('formidable');
const decompress = require('decompress');
const { unlinkDir, analysis } = require('./util.js');

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
const downloadDir = path.resolve(__dirname, './download')
app.get('/', (req, res, next) => {
    res.sendFile(path.resolve(__dirname, './dist/index.html'))
})
// 导入逻辑
app.get('/exports', (req, res, next) => {
    const downloadPath = path.resolve(__dirname, './download/resource.zip');
    if (fs.existsSync(downloadPath)) {
        console.log(chalk.yellow('下载文件已存在'))
        res.download(downloadPath);
    } else {
        compressing.zip
        .compressDir(resolve("/resource"), downloadPath)
        .then(() => {
            console.log(chalk.yellow(`[√]文件压缩成功.`));
            res.setContentType("application/octet-stream")
            res.download(downloadPath);
            // Todo 定期移除
        })
        .catch(err => {
            console.log(chalk.red("[×]压缩报错"));
            console.error(err);
        });
    }
})

// 导出逻辑
app.post('/imports', (req, res, next) => {
    // 解压客户端上传的zip文件夹
    // 判断上传文件夹的合法性
    const uploadPath = path.resolve(__dirname, './upload');
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath);
    }
    const form = new formidable.IncomingForm();
    form.uploadDir = uploadPath; //上传文件的保存路径
    form.keepExtensions = true; // 保存扩展名
    form.maxFieldsSize = 20 * 1024 * 1024; // 上传文件的最大大小
    form.parse(req, (err, fields, files) => {
        // console.log('files', files);//针对post请求
        res.header("Access-Control-Allow-Origin","*");
        // 清空解压文件夹
        console.log('[...]清空解压文件夹');
        unlinkDir(path.resolve(__dirname, './decompress'));
        console.log('[...]准备解压zip文件');
        decompress(path.resolve(files.file.path), path.resolve(__dirname, './decompress')).then(() => {
            console.log('[√]解压完成');
            fs.unlinkSync(path.resolve(files.file.path));
            console.log('[√]删除压缩包');
            // 开始分析压缩包
            const analysisResult = analysis(path.resolve(__dirname, './decompress'));
            if (analysisResult) { // 合法
                // 只需要分析第一级的目录
                // 存在相同目录(小概率事件)： 重命名
                // 不存在相同目录： copy到resource
                res.sendStatus(200);
                res.send({msg: '数据已上传'})
            } else {
                // 不合法
                res.sendStatus(504);
                res.send({msg: '压缩包不合法'})
            }

        })
    })
})

let inited = false;
app.listen(8111, () => {
    console.log('8111 is on server.')
    if (!inited) {
        // opn('http://localhost:8111', { app: 'chrome' });
        inited = true;
    }
})