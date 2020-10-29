import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './Style/common.less';
import 'antd/dist/antd.less';
import './Style/resetAntd.less';
import { Spin } from 'antd';
import Loading from 'src/Components/Loading';

// 全局替换spin组件图标
Spin.setDefaultIndicator(Loading);

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
