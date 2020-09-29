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
  const [membercardTable, setMembercardTable] = useState<any[]>([]);
  const [activeBox, setActiveBox] = useState<string>(''); // 选中的id
  useRequest(queryMembercardList, {
    onSuccess: (res: ApiRes) => {
      const { result } = res.result || {};

      setMembercardTable(result || []);

      if (!activeBox && result?.length) { // 默认选中
        setActiveBox(result[0].cardConfigId);
      }
    }
  });

  useLayoutEffect(() => {
    props.bread(bread);
  }, [props]);

  const changeMembercard = (id: string) => {
    setActiveBox(id);
  };

  return (
    <div className="membercard-setting-list">
      <Suspense fallback={<Loading />}>
        <MembercardList table={membercardTable} activeBox={activeBox} changeActive={changeMembercard} />
        <Suspense fallback={<Loading />}>
          <MembercardSettingStrategy cardConfigId={activeBox} />
        </Suspense>
      </Suspense>
    </div>
  );
}

export default MembercardSettingList;
