import React, { useState, useEffect } from 'react';
import { Form, Radio, Select } from 'antd';
import fetch from '@/Api';
import '@/Style/components.scss';

const { getAdminGroupList } = fetch;
const { Option } = Select;

function GroupAccount() {
  const [accountList, setAccountList] = useState([]);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(_ => {
    getAdminGroupList().then(res => {
      let { result } = res.result || [];
      let options = result.map(item => <Option key={item.enterUserGroupId}>{item.enterUserGroupName}</Option>)
      setAccountList(options);
    })
  }, [])

  const radioChange = e => {
    setShowOptions(e.target.value === 2 ? true : false)
  }

  return (
    <>
      <Form.Item
        name="account"
        label="可见此分组账号"
        rules={ [ {required: true, message: '请输入分组名称'} ] }>
        <Radio.Group onChange={radioChange}>
          <Radio value={1}>所有账号</Radio>
          <Radio value={2}>自己及部分账号</Radio>
          <Radio value={3}>仅自己</Radio>
        </Radio.Group>
      </Form.Item>
      {showOptions &&
      <Form.Item
        name="groupChoose"
        label=" "
        colon={false}
        className="cancelStar"
        rules={ [ {required: true, message: '请选择账号分组'} ] }>
        <Select
          mode="multiple"
          style={{ width: 440 }}
          placeholder="请选择账号分组 (可多选)">
          {accountList}
        </Select>
      </Form.Item>}
    </>
  )
}

export default GroupAccount;