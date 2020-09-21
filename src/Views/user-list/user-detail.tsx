import React, { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import EcuDetail from './user-detail-ecu';
import 'src/Style/user-detail.scss';

const bread = [
  {
    name: '用户列表',
    href: '#/user-list/user-list'
  },
  {
    name: '用户详情'
  }
];

function UserDetail(props: P) {
  const params = useParams<any>();

  useLayoutEffect(() => {
    props.bread(bread);
  }, [props]);

  return (
    <div className="user-detail">
      <EcuDetail ecuId={params.ecuId} />
    </div>
  );
}

export default UserDetail;
