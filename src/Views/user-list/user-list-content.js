import React from 'react'
import { Input, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

function UserContent() {
  return (
    <div className="userContent">
      <header className="contentHeader">用户共 {309} 人</header>
      <nav>
        <Input prefix={<SearchOutlined />} placeholder="请输入用户姓名/会员卡号/手机号/用户ID进行搜索" style={{ width: 370 }} />
        <Select style={{ width: 150 }} placeholder="批量操作">
          <Option value="1">调整积分</Option>
          <Option value="2">调整会员等级</Option>
          <Option value="3">修改服务门店</Option>
          <Option value="4">增加协管门店</Option>
          <Option value="5">批量导出会员</Option>
          <Option value="6">修改归属品牌</Option>
          <Option value="7">修改归属渠道</Option>
        </Select>
      </nav>
    </div>
  )
}

export default UserContent;