const chalk = require('chalk');
const fs = require("fs");
const path = require("path");
const MD = require('markdown-it')();
const fse = require('fs-extra');
const routerArr = [];

// 递归遍历文件
function readDirSync(paths) {
    const files = fs.readdirSync(paths);
    files.forEach((file) => {
        const nowPath = path.join(paths, './' + file);
        const fileInfo = fs.statSync(nowPath);
        if (fileInfo.isDirectory()) { // 目录
            readDirSync(nowPath);
        } else { // 文件
            transform(nowPath);
        }
    })
}

// 将markdown文件变成react组件
function transform(paths) {
    let pathStr = paths.replace(path.join(__dirname, '../resource'), '');
    pathStr = pathStr.replace('.md', '');
    pathStr = pathStr.replace(/\\/g, '/');
    const data = fs.readFileSync(paths);
    const component = MD.render(data.toString());
    // 确定新的目录
    const newPath = paths.replace('resource', 'model');
    const fileName = path.basename(newPath, '.md');
    const finalPath = newPath.replace('.md', '.jsx');
    routerArr.push({
        name: fileName,
        path: pathStr,
        unionName: fileName + '_' + routerArr.length
    });
    fse.ensureFile(finalPath, (err) => {
        if (err) {
            console.log(err);
            return
        }
        const result = createReactModel(fileName, component);
        fs.writeFileSync(finalPath, result);
    })
}

const goalPath = path.resolve(__dirname, '../resource');
readDirSync(goalPath);

const routerPath = path.resolve(__dirname, '../dist/dynamicRouter.js');
fse.ensureFile(routerPath, (err) => {
    if (err) {
        console.log(err);
        return
    }
    const result = createDynamicRouter(routerArr);
    fs.writeFileSync(routerPath, result);
});

const navigarPagePath = path.resolve(__dirname, '../model/entry.jsx');
fse.ensureFile(navigarPagePath, (err) => {
    if (err) {
        console.log(err);
        return
    }
    const result = createEntry(); // 动态首页
    fs.writeFileSync(navigarPagePath, result);
})

// 创建React组件单文件
function createReactModel(fileName, component) {
    return `// 动态markdown编译文件
import React, {Component} from 'react'
export default class ${fileName} extends Component{
    constructor() {
        super()
    }

    render() {
        return <div className="page"> 
            ${component}
        </div>
    }
}`
}

// 创建动态路由根文件
function createDynamicRouter(routerArr) {
    const importStr = routerArr.map((item) => {
        return `import ${item.unionName} from '${'../model' + item.path}';`
    }).join('\n');
    const routeStr = routerArr.map((item) => {
        return `            <Route path="${item.path}" component={${item.unionName}}></Route>`
    }).join('\n');
    return `// 动态路由文件
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route } from 'react-router-dom';
import entryPage from '../model/entry';
${importStr}
import * as serviceWorker from '../serviceWorker';
ReactDOM.render(
    <HashRouter>
        <div id="rootPage">
            <Route path="/" component={entryPage}></Route>
${routeStr}
        </div>
    </HashRouter>,
    document.getElementById('root'));
serviceWorker.unregister();
`
}

// 创建根入口文件
function createEntry() {
    let obj = {};
    routerArr.forEach(item => {
        let arr = item.path.split('/');
        if (arr.length === 2) { // 根文件
            obj[arr[1]] = true;
        } else { // 多级目录
            let copyObj = Object.assign({}, obj)
            let nextObj = copyObj
            for (var i = 1; i < arr.length; i++) {
                if (!(arr[i] in nextObj)) {
                    if (i === arr.length - 1) { // 最后一个
                        nextObj[arr[i]] = true
                    } else {
                        nextObj[arr[i]] = {}
                    }
                }
                nextObj = nextObj[arr[i]]
            }
            obj = Object.assign(copyObj, obj)
        }
    })

    // 循环部分
    function loop(obj, arr, _path) {
        for (var key in obj) {
            if (typeof obj[key] === 'object') { // 目录
                arr.push(`
                <div className="menu">
                    ${key}
                    <div className="son">
${loop(obj[key], [], _path + '/' + key).join('\n')}
                    </div>
                </div>`)
            } else { // 文章
                let new_path = _path + '/' + key
                arr.push(`                        <div className="item"><Link to='${new_path}'>${key}</Link></div>`)
            }
        }
        return arr
    }
    let loopArr = []
    let loopStr = loop(obj, loopArr, '').join('\n');
    return `// 动态首页
import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import Toolbar from '../components/toolbar/index';
export default class index extends Component {
    constructor() {
        super()
    }

    render() {
        return <div className="homePage">
        <div className='brumb'>
            <Link className="title" to="/">首页</Link>
            ${loopStr}
        </div>
        <div className="toolbar">
            <Toolbar/>
        </div>
        </div>
    }
}`
}

console.log(chalk.green('[√]动态路由编译完成。'));

