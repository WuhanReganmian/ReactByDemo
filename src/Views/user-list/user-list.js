import React, { useLayoutEffect, useState } from 'react';
import '@/Style/user-list.scss';
import UserGroup from './user-list-group';
import UserContent from './user-list-content';

const bread = [
  {
    name: '用户列表'
  }
]


function UserList(props) {
  const [userGroupId, setUserGroupId] = useState('')
  useLayoutEffect(() => {
    props.bread(bread);
  }, [props])

  const groupIdChange = id => {
    setUserGroupId(id || '')
  }

  return (
    <div className="routeContent">
      <UserGroup change={groupIdChange} />
      <UserContent groupId={userGroupId} />
    </div>
  )
}

export default UserList;