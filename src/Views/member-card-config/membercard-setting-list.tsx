import React, { lazy, Suspense, useLayoutEffect, useState } from 'react';
import Loading from 'src/Components/Loading';
import 'src/Style/membercard-setting-list.scss';
import fetch from "src/Api";
import { useRequest } from '@umijs/hooks';

const { queryMembercardList } = fetch;

const MembercardList = lazy(() => import('src/Components/MembercardList'));
const MembercardSettingStrategy = lazy(() => import('./membercard-setting-strategy'));

const bread = [
  {
    name: '会员卡设置'
  }
];

function MembercardSettingList(props: P) {
  // eslint-disable-next-line
  const [membercardTable, setMembercardTable] = useState([]);
  useRequest(() => {
    return queryMembercardList();
  });

  useLayoutEffect(() => {
    props.bread(bread);
  }, [props]);

  return (
    <div className="membercard-setting-list">
      <Suspense fallback={<Loading />}>
        <MembercardList />
        <Suspense fallback={<Loading />}>
          <MembercardSettingStrategy />
        </Suspense>
      </Suspense>
    </div>
  );
}

export default MembercardSettingList;
