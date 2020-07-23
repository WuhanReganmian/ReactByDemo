import React, { useLayoutEffect, useState, useCallback } from 'react';
import { Button, Space, Modal, Form, Input, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import GroupAccount from '@/Components/AccountGroup';
import fetch from '@/Api';

const { queryGroupList, addGroupList, checkGroupLimit, delGroupList, getGroupDetail, saveGroupList } = fetch;
const { confirm } = Modal;

function UserGroup() { // 分组
  const [groupList, setGroupList] = useState([]);
  const [groupCheck, setGroupCheck] = useState('');
  const [groupVisible, setGroupVisible] = useState(false);
  const [groupConfig, setGroupConfig] = useState(false);
  const [groupLoading, setGroupLoading] = useState(false);
  const [groupId, setGroupId] = useState(0);
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
  const handleGroupOk = _ => { // 新建/保存分组
    groupForm.validateFields().then(values => {
      setGroupLoading(true);
      const { title, people, account, groupChoose } = values;
      let params = {
        groupName: title,
        editType: account,
        editUserGroupList: groupChoose,
        memberScreenId: people,
        userGroupId: groupId || undefined
      }
      if(groupId) {
        saveGroupList(params).then(res => {
          getGroupList();
          message.success('保存成功');
          setGroupVisible(false);
          setGroupLoading(false);
        }).catch(_ => setGroupLoading(false))
      } else {
        addGroupList(params).then(res => {
          getGroupList();
          message.success('新建成功');
          setGroupVisible(false);
          setGroupLoading(false);
        }).catch(_ => setGroupLoading(false))
      }
    })
  }
  const openGroupModal = () => { // 打开新建分组弹框
    setGroupId(0);
    setGroupVisible(true);
  }
  const groupClosed = _ => { // 关闭重置数据
    groupForm.resetFields();
  }

  const handleConfigCancel = _ => { // 关闭分组管理
    setGroupConfig(false);
  }
  const openEditGroup = useCallback(userGroupId => { // 编辑打开
    getGroupDetail({ userGroupId }).then(res => {
      const { groupName, editType, editUserGroupList } = res.result || {};
      groupForm.setFieldsValue({
        title: groupName || '',
        account: editType || 1,
        groupChoose: editUserGroupList || []
      })
      openGroupModal();
      setGroupId(userGroupId)
    })
  }, [groupForm])
  const delGroup = useCallback(userGroupId => { // 删除分组
    confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: '确认删除该用户分组？',
      okText: '确认删除',
      cancelText: '取消',
      onOk() {
        return delGroupList({ userGroupId }).then(res => {
          getGroupList();
          message.success('删除成功');
        })
      },
    });
  }, [])
  const checkLimit = useCallback((userGroupId, type) => { // 检查操作权限
    checkGroupLimit({ userGroupId }).then(res => {
      if(!res.result) return message.warning('您没有权限操作');
      type === 2 && delGroup(userGroupId);
      type === 1 && openEditGroup(userGroupId)
    })
  }, [delGroup, openEditGroup])

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
        title={groupId ? '编辑用户分组' : '新建用户分组'}
        visible={groupVisible}
        okText={groupId ? '保存' : '确认新建'}
        cancelText="取消"
        width="700px"
        destroyOnClose
        onOk={handleGroupOk}
        confirmLoading={groupLoading}
        onCancel={handleGroupCancel}
        afterClose={groupClosed}>
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
          <GroupAccount accountVal={groupForm.getFieldValue('account')} />
        </Form>
        {groupForm.title}
      </Modal>

      <Modal
        title="分组管理"
        visible={groupConfig}
        footer={null}
        onCancel={handleConfigCancel}>
        <div className="groupConfig">
          {
            groupList.map(item => {
              return (
                <div key={item.userGroupId} className="configBox">
                  <span>{item.groupName}</span>
                  <span>
                    <Button type="text" onClick={_ => checkLimit(item.userGroupId, 1)}>编辑</Button>
                    <Button type="text" onClick={_ => checkLimit(item.userGroupId, 2)}>删除</Button>
                  </span>
                </div>
              )
            })
          }
        </div>
        <div className="addBtn" onClick={openGroupModal}>+ 添加分组</div>
      </Modal>
    </div>
  )
}

export default UserGroup;