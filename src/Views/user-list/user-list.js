import React, { useLayoutEffect } from 'react';
// import { Button, Space, Modal, Form, Input, message } from 'antd';
import '@/Style/user-list.scss';
import UserGroup from './user-list-group';
import UserContent from './user-list-content';
// import fetch from '@/Api';

// const {  } = fetch;

const bread = [
  {
    name: '用户列表'
  }
]


function UserList(props) {
  useLayoutEffect(() => {
    props.bread(bread);
  }, [props])
  return (
    <div className="routeContent">
      <UserGroup />
      <UserContent />
    </div>
  )
}

export default UserList;