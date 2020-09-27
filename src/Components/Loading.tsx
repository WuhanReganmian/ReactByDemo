import React from 'react';
import { Spin } from 'antd';

const Style = {
  width: '100%',
  height: 500,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

function Loading() {
  return (
    <div style={Style}>
      <Spin />
    </div>
  );
}

export default Loading;
