import React, { useState } from 'react';
import { Table, Switch } from 'antd';
import fetch from "src/Api";
import { useRequest } from '@umijs/hooks';

const { queryMembercardStrategyList } = fetch;

interface MembercardSettingStrategyP {
  cardConfigId: string;
}

function AuthStep(props: MembercardSettingStrategyP) {
  // eslint-disable-next-line
  const [table, setTable] = useState<any[]>([]);
  useRequest(() => {
    if (!props.cardConfigId) return Promise.reject();
    return queryMembercardStrategyList({ id: props.cardConfigId });
  }, {
    onSuccess: (res: ApiRes) => {
      setTable(res?.result || []);
    },
    refreshDeps: [props.cardConfigId]
  });

  const onSwitchChange = (row: any) => {};

  const columns: ColumnV[] = [
    {
      title: '开卡场景',
      dataIndex: 'sceneName',
      key: 'sceneName'
    },
    {
      title: '会员信息',
      dataIndex: 'sceneName',
      key: 'sceneName',
      render: (v: any, row: any)  => {
        return <Switch onChange={() => onSwitchChange(row)} defaultChecked={row?.list?.[0]?.use === 1 ? true : false} />;
      }
    },
    {
      title: '常驻城市',
      dataIndex: 'sceneName',
      key: 'sceneName',
      render: (v: any, row: any) => {
        return <Switch onChange={() => onSwitchChange(row)} defaultChecked={row?.list?.[1]?.use === 1 ? true : false} />;
      }
    },
    {
      title: '服务门店',
      dataIndex: 'sceneName',
      key: 'sceneName',
      render: (v: any, row: any)  => {
        return <Switch onChange={() => onSwitchChange(row)} defaultChecked={row?.list?.[2]?.use === 1 ? true : false} />;
      }
    },
    {
      title: '专属导购',
      dataIndex: 'sceneName',
      key: 'sceneName',
      render: (v: any, row: any)  => {
        return <Switch onChange={() => onSwitchChange(row)} defaultChecked={row?.list?.[3]?.use === 1 ? true : false} />;
      }
    }
  ];
  return (
    <div className="strategy-box">
      <header>认证步骤</header>
      <Table columns={columns} dataSource={table} rowKey={k => k.id} />
    </div>
  );
}

function MembercardSettingStrategy(props: MembercardSettingStrategyP) {
  return (
    <div className="membercard-setting-strategy">
      <AuthStep cardConfigId={props.cardConfigId} />
    </div>
  );
}

export default MembercardSettingStrategy;
