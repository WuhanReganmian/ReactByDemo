import React from 'react';
import { Form } from 'antd';

function EcuDetail(props) {
  return (
    <div className="ecu-detail detailPulic">
      <header>用户信息</header>
      <div className="basics">
        <div className="basics-left">
          <Form labelCol={{ span: 3 }} wrapperCol={{ span: 8 }}>
            <Form.Item label="姓名">123</Form.Item>
            <Form.Item label="昵称">123</Form.Item>
            <Form.Item label="性别">123</Form.Item>
            <Form.Item label="年龄">123</Form.Item>
          </Form>
        </div>
        <div className="basics-right">
          {/* <img src={baseInfo.imgUrl} /> */}
        </div>
      </div>
    </div>
  )
}

export default EcuDetail;