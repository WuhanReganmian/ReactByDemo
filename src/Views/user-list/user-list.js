import React, { useLayoutEffect } from 'react';

const bread = [
  {
    name: '用户列表'
  }
]

function UserList(props) {
  useLayoutEffect(() => {
    props.bread(bread);
  }, [props])
  return <div className="routeContent">1</div>
}

export default UserList;