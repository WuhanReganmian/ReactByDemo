import React, { useLayoutEffect } from 'react'

const bread = [
  {
    name: '用户列表',
    href: '#/user-list/user-list'
  },
  {
    name: '用户详情'
  }
]

function UserDetail(props) {
  useLayoutEffect(_ => {
    props.bread(bread);
  }, [props])
  return <div>1</div>
}

export default UserDetail;