import React, { useState, useCallback, useEffect } from 'react';
import './index.less';
import _ from 'lodash'
export default function Menu (props) {
    const [treeData, setTreeData] = useState([]);
    const { data, array } = props;
    const addExpand = (data) => {
        if (data.type === 'directory') {
            data.expand = false;
            data.children && data.children.map(addExpand);
        }
        return data
    }
    // 初始化
    useEffect(() => {
        const result = data.map(addExpand);
        console.log('result', result);
        setTreeData(result);
    }, [data]);

    const updateTreeState = useCallback((id, change) => {
        const copy = _.cloneDeep(treeData);
        const loop = (data) => {
            data.forEach(it => {
                if (it.id === id) {
                    it.expand = change
                } else if (it.children) {
                    loop(it.children);
                }
            })
        }
        loop(copy);
        console.log('change', copy)
        setTreeData(copy);
    }, [treeData]);

    console.log('treeData', treeData);
    return <div className="menu">
        {Tree(treeData, updateTreeState)}
    </div>
}

function Tree(data, updateTreeState) {
    return data 
    ?
    data.map(item => {
        return parentNode(item, updateTreeState)
    })
    :
    null
}


// 父节点
function parentNode(data, updateTreeState) {
    return <div className="tree-branch" key={data.id} onClick={(e) => {
            const change = !data.expand;
            e.stopPropagation();
            updateTreeState(data.id, change);
        }}>
        <span className="flag-expand">{data.expand ? '-' : '+'}</span>
        {data.name}
        {data.expand && data.children && data.children.map(item => {
            console.log('item', item)
            return item.type === 'file' ? childNode(item) : parentNode(item, updateTreeState);
        })}
    </div>
}

// 子节点
function childNode(data) {
    return <div className="tree-node" key={data.id}>
        {data.name}
    </div>
}