// 构建脚本， 将markdown文档解析过程
const fs = require("fs");
const path = require("path");
const MD = require('markdown-it')();
const fse = require('fs-extra');
const shelljs = require('shelljs');
var routerArr = []
/**
 * 遍历：
 * 1、生成目录结构
 * 2、生成react组件
 */

// 递归遍历文件
function readDirSync(paths) {
    let files = fs.readdirSync(paths);
    files.forEach((file) => {
        let nowPath = path.join(paths, './' + file)
        let fileInfo = fs.statSync(nowPath);
        if (fileInfo.isDirectory()) { // 目录
            readDirSync(nowPath);
        } else { // 文件
            transform(nowPath);
        }
    })
}

// 将markdown文件变成react组件
function transform(paths) {
    let pathStr = paths.replace(path.join(__dirname, './resource'), '')
    pathStr = pathStr.replace('.md', '');
    pathStr = pathStr.replace(/\\/g, '/')
    let data = fs.readFileSync(paths)
    let component = MD.render(data.toString())
    // 确定新的目录
    let newPath = paths.replace('resource', 'model');
    let fileName = path.basename(newPath, '.md');
    let finalPath = newPath.replace('.md', '.jsx');
    routerArr.push({
        name: fileName,
        path: pathStr,
        unionName: fileName + '_' + routerArr.length
    })
    fse.ensureFile(finalPath, (err) => {
        if (err) {
            console.log(err);
            return
        }
        let result = createReactModel(fileName, component);
        fs.writeFileSync(finalPath, result);
    })
}

var goalPath = path.resolve(__dirname, 'resource')
readDirSync(goalPath);
let indexPagePath = path.resolve(__dirname, 'index.js');
fse.ensureFile(indexPagePath, (err) => {
    if (err) {
        console.log(err);
        return
    }
    let result = createIndexPage(routerArr);
    fs.writeFileSync(indexPagePath, result);
})

let navigarPagePath = path.resolve(__dirname, './model/index.jsx');
fse.ensureFile(navigarPagePath, (err) => {
    if (err) {
        console.log(err);
        return
    }
    let result = createRootModel();
    fs.writeFileSync(navigarPagePath, result);
})
// 创建React组件单文件
function createReactModel(fileName, component) {
    return `
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
    }
    `
}

// 创建根文件
function createIndexPage(routerArr) { // name: about, path: 'about/index', unionName: about_1
    let importStr = routerArr.map((item) => {
        return `import ${item.unionName} from '${'./model' + item.path}';`
    }).join('\n')
    let routeStr = routerArr.map((item) => {
        return `<Route path="${item.path}" component={${item.unionName}}></Route>`
    }).join('\n')
    return `
    import React from 'react';
    import ReactDOM from 'react-dom';
    import { BrowserRouter, HashRouter, Route } from 'react-router-dom';
    import indexPage from './model/index';
    ${importStr}
    import * as serviceWorker from './serviceWorker';
    ReactDOM.render(
        <HashRouter>
            <div id="rootPage">
            <Route path="/" component={indexPage}></Route>
            ${routeStr}
            </div>
        </HashRouter>,
        document.getElementById('root'));
    serviceWorker.unregister();
    `
}


// 制造model根组件
function createRootModel() {
    /** true为文件截止
     *  {
     *      about:  {index： true},
     *      index:  true, // 根文件
     *      main:  {
     *                 index:  {test: true},
     *                  run: true
     *              }
     *  }
     */
    let obj = {}
    routerArr.forEach(item => {
        let arr = item.path.split('/')
        if (arr.length === 2) { // 根文件
            obj[arr[1]] = true
        } else { // 多级目录
            let copyObj = Object.assign({}, obj)
            let nextObj = copyObj
            for (var i = 1; i < arr.length; i++) {
                if (!(arr[i] in nextObj)) {
                    if (i === arr.length - 1) {// 最后一个
                        nextObj[arr[i]] = true
                    } else {
                        nextObj[arr[i]] = {}
                    }
                }
                nextObj = nextObj[arr[i]]
            }
            // console.log(copyObj)
            obj = Object.assign(copyObj, obj)
        }
    })  //  path: '/about/index'   name: 'index'

    // console.log(obj)
    // 循环部分
    function loop(obj, arr, _path) {
        for (var key in obj) {
            if (typeof obj[key] === 'object') { // 目录
                arr.push(`
                <div className="menu">${key}
                    <div className="son">
                        ${loop(obj[key], [], _path + '/' + key).join('\n')}
                    </div>
                </div>`)
            } else { // 文章
                let new_path = _path + '/' + key
                arr.push(`<div className="item"><Link to='${new_path}'>${key}</Link></div>`)
            }
        }
        return arr
    }
    let loopArr = []
    let loopStr = loop(obj, loopArr, '').join('\n')
    return `
    import React, { Component } from 'react'
    import { Link } from 'react-router-dom';
    export default class index extends Component {
        constructor() {
            super()
        }

        render() {
            return <div className='brumb'>
                <div className="title">导航</div>
                ${loopStr}
            </div>
        }
    }`
}


console.log('构建成功,准备打包')

shelljs.exec('node server.js')
