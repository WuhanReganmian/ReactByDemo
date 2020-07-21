import React, { useLayoutEffect, useState, useCallback } from 'react';
import { Button, Space } from 'antd';
import '@/Style/user-list.scss';
import fetch from '@/Api';

const { queryGroupList } = fetch;

const bread = [
  {
    name: '用户列表'
  }
]

function UserGroup() {
  const [groupList, setGroupList] = useState([]);
  const [groupCheck, setGroupCheck] = useState('');

  useLayoutEffect(_ => {
    queryGroupList().then(res => {
      let result = res.result || []
      setGroupList(result);
      setGroupCheck(result.length ? result[0].userGroupId : '');
    })
  }, [])

  const changeActive = useCallback(id => {
    setGroupCheck(id)
  }, [])

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
        <Button type="primary">新建分组</Button>
        <Button type="primary">分组管理</Button>
      </Space>
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