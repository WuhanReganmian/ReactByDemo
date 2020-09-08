import React, { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import EcuDetail from './user-detail-ecu';
import '@/Style/user-detail.scss';

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
  const params = useParams();

  useLayoutEffect(_ => {
    props.bread(bread);
  }, [props])

  return (
    <div className="user-detail">
      <EcuDetail ecuId={params.ecuId} />
    </div>
  )
}

export default UserDetail;