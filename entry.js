// 动态路由文件
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route } from 'react-router-dom';
import rootPage from './components/root';
import * as serviceWorker from './serviceWorker';
ReactDOM.render(
    <HashRouter>
        <div id="rootPage">
            <Route path="/" component={rootPage}></Route>
        </div>
    </HashRouter>,
    document.getElementById('root'));
serviceWorker.unregister();
