import React, { useState, useEffect } from 'react';
import { Form, Radio, Select } from 'antd';
import fetch from 'src/Api';
import { useRequest } from '@umijs/hooks';
import 'src/Style/components.scss';

const { getAdminGroupList } = fetch;
const { Option } = Select;

interface GroupAccountType {
  accountVal: number;
}

function GroupAccount(props: GroupAccountType) {
  const [accountList, setAccountList] = useState<any[]>([]);
  const [showOptions, setShowOptions] = useState<number>(1);
  useRequest(getAdminGroupList, {
    onSuccess: (res: ApiRes) => {
      let { result } = res.result || [];
      let options = result.map((item: any) => <Option key={item.enterUserGroupName} value={item.enterUserGroupId}>{item.enterUserGroupName}</Option>);
      setAccountList(options);
    }
  });

  useEffect(() => {
    setShowOptions(props.accountVal);
  }, [props.accountVal]);

  const radioChange = (e: any) => {
    setShowOptions(e.target.value);
  };

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
      {showOptions === 2 &&
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
  );
}

export default GroupAccount;
