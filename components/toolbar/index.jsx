import React from 'react';
import './index.less';
export default function toolbar() {
    // 导出方法
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

    function imports() {
        const input = document.createElement('input');
        const body = document.querySelector('body');
        input.type = 'file';
        input.accept = '.zip';
        input.style.display = 'none';
        body.appendChild(input);
        input.click();
        input.onchange = (e) => {
            console.log('change', e)
            e.preventDefault();
            const file = e.target.files[0];
            const formdata = new FormData();
            formdata.append('file', file);
            fetch('/imports', {
                method: 'POST',
                body: formdata
            }).then(response => {
                console.log('response', response.json())
            })
        }
        // body.removeChild(input);
    }

    return <div className='toolbarContainer'>
        <div className="toolbarItem" onClick={imports}>导入</div>
        <div className="toolbarItem" onClick={exports}>导出</div>
        <div className="toolbarItem">新增</div>
        <div className="toolbarItem">编辑目录</div>
    </div>
}
