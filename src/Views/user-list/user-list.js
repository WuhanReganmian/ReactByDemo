import React, { useLayoutEffect, useState, useCallback } from 'react';
import { Button, Space, Modal, Form, Input, message } from 'antd';
import '@/Style/user-list.scss';
import fetch from '@/Api';
import GroupAccount from '@/Components/AccountGroup';

const { queryGroupList, addGroupList } = fetch;

const bread = [
  {
    name: '用户列表'
  }
]

function UserGroup() { // 分组
  const [groupList, setGroupList] = useState([]);
  const [groupCheck, setGroupCheck] = useState('');
  const [groupVisible, setGroupVisible] = useState(false);
  const [groupConfig, setGroupConfig] = useState(false);
  const [groupLoading, setGroupLoading] = useState(false);
  const [groupForm] = Form.useForm();

  useLayoutEffect(_ => { // created
    getGroupList();
  }, [])

  const getGroupList = _ => { // 获取分组列表
    queryGroupList().then(res => {
      let result = res.result || []
      setGroupList(result);
      setGroupCheck(result.length ? result[0].userGroupId : '');
    })
  }

  const changeActive = useCallback(id => { // 切换分组
    setGroupCheck(id)
  }, [])

  const handleGroupCancel = _ => { // 关闭新建分组
    setGroupVisible(false);
    setGroupLoading(false);
  }
  const handleGroupOk = _ => { // 新建分组
    groupForm.validateFields().then(values => {
      setGroupLoading(true);
      const { title, people, account, groupChoose } = values;
      let params = {
        groupName: title,
        editType: account,
        editUserGroupList: groupChoose,
        memberScreenId: people
      }
      addGroupList(params).then(res => {
        getGroupList();
        message.success('新建成功');
        setGroupVisible(false);
        setGroupLoading(false);
      }).catch(_ => setGroupLoading(false))
    })
  }
  const openGroupModal = () => { // 打开新建分组弹框
    setGroupVisible(true);
  }

  const handleConfigCancel = _ => { // 关闭分组管理
    setGroupConfig(false);
  }

  return (
    <div className="userGroup">
      <div className="groupTitle">用户分组</div>
      <Space className="groupList">
        {
          groupList.map(item => {
            return (
              <span
                className={`groupBox ${groupCheck === item.userGroupId ? 'groupActive' : ''}`}
                key={item.userGroupId}
                onClick={_ => changeActive(item.userGroupId)}>
                { item.groupName }
              </span>
            )
          })
        }
      </Space>
      <Space className="groupBtn">
        <Button type="primary" onClick={openGroupModal}>新建分组</Button>
        <Button type="primary" onClick={_ => setGroupConfig(true)}>分组管理</Button>
      </Space>

      <Modal
        title="新建用户分组"
        visible={groupVisible}
        okText="确认新建"
        cancelText="取消"
        width="700px"
        onOk={handleGroupOk}
        confirmLoading={groupLoading}
        onCancel={handleGroupCancel}>
        <Form
          name="groupForm"
          form={groupForm}
          initialValues={{ account: 1, people: 124 }}
          labelCol={{span: 6}}
          wrapperCol={{span: 16}}>
          <Form.Item
            name="title"
            label="分组名称"
            rules={ [ {required: true, message: '请输入分组名称'} ] }>
            <Input placeholder="请输入分组名称" maxLength="10" style={{width: 440}} autoComplete="off" />
          </Form.Item>
          <Form.Item
            name="people"
            hidden
            label="人群筛选">
            <Input />
          </Form.Item>
          <GroupAccount />
        </Form>
        {groupForm.title}
      </Modal>

      <Modal
        title="分组管理"
        visible={groupConfig}
        footer={null}
        onCancel={handleConfigCancel}>
        <div>123</div>
      </Modal>
    </div>
  )
}

function UserList(props) {
  useLayoutEffect(() => {
    props.bread(bread);
  }, [props])
  return (
    <div className="routeContent">
      <UserGroup />
    </div>
  )
}

export default UserList;