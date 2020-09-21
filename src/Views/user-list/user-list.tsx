import React, { useLayoutEffect, useState } from 'react';
import 'src/Style/user-list.scss';
import UserGroup from './user-list-group';
import UserContent from './user-list-content';

const bread = [
  {
    name: '用户列表'
  }
];

function UserList(props: P) {
  const [userGroupId, setUserGroupId] = useState<string>('');

  useLayoutEffect(() => {
    props.bread(bread);
  }, [props]);

  const groupIdChange = (id: string) => {
    setUserGroupId(id || '');
  };

  return (
    <>
      <UserGroup change={groupIdChange} />
      <UserContent groupId={userGroupId} />
    </>
  );
}

export default UserList;
