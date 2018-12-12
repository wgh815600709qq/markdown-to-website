
    import React from 'react';
    import ReactDOM from 'react-dom';
    import { BrowserRouter, HashRouter, Route } from 'react-router-dom';
    import indexPage from './model/index';
    import index_0 from './model/about/index';
import index_1 from './model/main/index';
import test_2 from './model/main/test';
import index_3 from './model/mine/index';
import after18_4 from './model/mine/memory/after18';
import before18_5 from './model/mine/memory/before18';
    import * as serviceWorker from './serviceWorker';
    ReactDOM.render(
        <HashRouter>
            <div id="rootPage">
            <Route path="/" component={indexPage}></Route>
            <Route path="/about/index" component={index_0}></Route>
<Route path="/main/index" component={index_1}></Route>
<Route path="/main/test" component={test_2}></Route>
<Route path="/mine/index" component={index_3}></Route>
<Route path="/mine/memory/after18" component={after18_4}></Route>
<Route path="/mine/memory/before18" component={before18_5}></Route>
            </div>
        </HashRouter>,
        document.getElementById('root'));
    serviceWorker.unregister();
    