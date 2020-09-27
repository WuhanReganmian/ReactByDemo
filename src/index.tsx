import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './Style/common.less';
import 'antd/dist/antd.less';
import './Style/resetAntd.less';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

// 全局替换spin组件图标
const Loading = <Spin indicator={<LoadingOutlined style={{ fontSize: 28 }} spin />} />;
Spin.setDefaultIndicator(Loading);

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
