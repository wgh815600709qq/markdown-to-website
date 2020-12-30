const fs = require('fs');
const path = require('path');
function unlinkDir(url) {
    var files = [];
    if (fs.existsSync(url)) {
        files = fs.readdirSync(url);
        files.forEach(function (file, index) {
            const curPath = path.join(url, file);
            if (fs.statSync(curPath).isDirectory()) { // recurse
                unlinkDir(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(url);
    } else {
        console.log("给定的路径不存在，请给出正确的路径");
    }
}

// 解压包分析, 全部文件都为makedown,即md为文件后缀
function analysis (_path) {
    const result = getDirInfo(_path);
    // console.log(result);
    return result.filter(it => it.type === 'file').every(it => it.name.endsWith('.md'))
}


const getDirInfo = (dirPath) => {
    const results = [];
    const mapDir = (dirPath, directoryIndex = 0) => {
        if (fs.existsSync(dirPath)) {
            const files = fs.readdirSync(dirPath);
            files.forEach((item) => {
                const fPath = path.join(dirPath, item);
                const stat = fs.statSync(fPath);
                if (stat.isDirectory()) {
                    results.push({
                        path: fPath,
                        name: item,
                        type: 'directory',
                        index: directoryIndex
                    })
                    mapDir(fPath, directoryIndex + 1)
                } else if (stat.isFile()) {
                    results.push({
                        path: fPath,
                        name: item,
                        type: 'file',
                        index: directoryIndex
                    })
                }
            })
        }
    }
    mapDir(dirPath)
    return results
}

// 合并
const merge = () => {
    const decompressPath = path.resolve(__dirname, './decompress');
    const destPath = path.resolve(__dirname, '../resource');
    if (fs.existsSync(decompressPath)) {
        const files = fs.readdirSync(decompressPath);
        files.forEach((item) => {
            console.log('item', item);
            const fPath = path.join(decompressPath, item);
            const stat = fs.statSync(fPath);
            if (stat.isDirectory()) {
                let name = item;
                if (fs.existsSync(path.resolve(destPath, item))) {
                    name = `${item}_${new Date().getTime()}`;
                    fs.renameSync(path.resolve(decompressPath, item), path.resolve(decompressPath, name));
                    console.log('files1', fs.readdirSync(path.resolve(decompressPath, name)));
                }
                console.log('debugger2')
                copyDir(path.resolve(decompressPath, name), path.resolve(destPath, name))
            } else if (stat.isFile()) {
                let name = item;
                if (fs.existsSync(path.resolve(destPath, item))) {
                    name = `${item.slice(0, item.length - 2)}${new Date().getTime()}.md`;
                    console.log('name', name)
                    fs.renameSync(path.resolve(decompressPath, item), path.resolve(decompressPath, name));
                    console.log('files2', fs.readdirSync(path.resolve(decompressPath, name)));
                } else {
                    fs.writeFileSync(path.resolve(destPath, name), fs.readFileSync(path.resolve(decompressPath, name)));
                }
                console.log('debugger3')
            }
        })
    }
}

const copyDir = (from, to) => {
    fs.mkdirSync(to);
    if (fs.existsSync(from)) {
        const files = fs.readdirSync(from);
        files.forEach(item => {
            const fPath = path.join(from, item);
            const stat = fs.statSync(fPath);
            if (stat.isDirectory()) {
                copyDir(fPath, path.resolve(to, item));
            } else if (stat.isFile()) {
                fs.writeFileSync(path.resolve(to, item), fs.readFileSync(path.resolve(from, item)));
            }
        })
    } else {
        console.log('目录不存在', from)
    }
}
module.exports = {
    unlinkDir: unlinkDir,
    analysis,
    merge,
    getDirInfo
}