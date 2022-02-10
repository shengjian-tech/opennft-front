import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { storage } from 'src/commons/ra-lib';
import App from './App';
import { store } from './models';
import { getLoginUser } from './commons';

import './index.css';
import './index.mobile.css';


// dev 模式开启mock
if (process.env.NODE_ENV === 'development' || process.env.MOCK === 'true') {
    require('./mock/index');
    console.log('current mode is development, mock is enabled');
}

const currentUser = getLoginUser() || {};

// 存储初始化 区分不同用户存储的数据
storage.init({
    keyPrefix: currentUser.id,
});


ReactDOM.render(<Provider store={store}><App/></Provider>, document.getElementById('root'));
