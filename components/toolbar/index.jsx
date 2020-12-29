import React from 'react';
import './index.less';
export default function toolbar() {
    function exports() {
        fetch('/exports').then(function (response) {
            response.blob().then((blob) => {
                saveBlobAs(blob, 'resource.zip')
            })
        }, function (result) {
            console.info("获取数据失败" + result.message);
        });
    }
    // 保存bolb的方法
    function saveBlobAs(blob, filename) {
        if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, filename)
        } else {
            const anchor = document.createElement('a')
            const body = document.querySelector('body')
            anchor.href = window.URL.createObjectURL(blob)
            anchor.download = filename
            anchor.style.display = 'none'
            body.appendChild(anchor)
            anchor.click()
            body.removeChild(anchor)
            window.URL.revokeObjectURL(anchor.href)
        }
    }

    return <div className='toolbarContainer'>
        <div className="toolbarItem">导入</div>
        <div className="toolbarItem" onClick={exports}>导出</div>
        <div className="toolbarItem">新增</div>
        <div className="toolbarItem">编辑目录</div>
    </div>
}
