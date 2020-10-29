import React, { useState } from 'react';
import { Table, Switch, Alert, Button, Popconfirm, message } from 'antd';
import fetch from "src/Api";
import { useRequest } from '@umijs/hooks';

const { queryMembercardStrategyList, queryMemberLevelList, delMemberLevelList } = fetch;

interface MembercardSettingStrategyP {
  cardConfigId: string;
}

// 认证步骤
function AuthStep(props: MembercardSettingStrategyP) {
  const [table, setTable] = useState<any[]>([]);

  const { loading } = useRequest(() => {
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
      <Table columns={columns} dataSource={table} rowKey="id" pagination={false} loading={loading} />
    </div>
  );
}

// 会员等级
function MemberLevel(props: MembercardSettingStrategyP) {
  const [table, setTable] = useState<any[]>([]);

  const { run: getTableRun, loading } = useRequest(() => { // 接口：获取表格数据
    if (!props.cardConfigId) return Promise.reject();
    return queryMemberLevelList({ cardConfigId: props.cardConfigId });
  }, {
    onSuccess: (res: ApiRes) => {
      setTable(res?.result || []);
    },
    refreshDeps: [props.cardConfigId]
  });

  const { run: delMembercardRun } = useRequest((id: string) => delMemberLevelList({ id }), { // 接口：删除会员卡等级
    manual: true,
    onSuccess: () => {
      getTableRun();
      message.success('删除成功');
    }
  });

  const toAddMemberLevel = () => {};

  const toEdit = () => {};

  const columns: ColumnV[] = [
    {
      title: '会员卡卡面',
      dataIndex: 'backgroundType',
      key: 'backgroundType',
      render: (_: any, row: any) => {
        return (
          <div
            className="membercard-style"
            style={{
              'backgroundColor': row.backgroundType === 1 ? row.background : 'none',
              'backgroundImage': row.backgroundType === 2 ? ('url(' + row.background + ')') : 'none',
              'backgroundRepeat': 'no-repeat',
              'color': row.backgroundWords
            }}>
            { row.gradeName }
          </div>
        );
      }
    },
    {
      title: '会员等级代码',
      dataIndex: 'gradeCode',
      key: 'gradeCode'
    },
    {
      title: '会员等级类型',
      dataIndex: 'gradeType',
      key: 'gradeType',
      render: (v: number) => {
        return <span>{ ['常规卡', '特殊卡']?.[--v] || '--' }</span>;
      }
    },
    {
      title: '操作',
      dataIndex: 'sceneName',
      key: 'sceneName',
      render: (_: any, row: any) => {
        return (
          <>
            <Button type="text" onClick={toEdit}>编辑</Button>
            <Button type="text" onClick={toEdit}>设置策略</Button>
            <Popconfirm
              title="确认删除该会员卡吗？"
              onConfirm={() => delMembercardRun(row.id)}
              okText="确认删除"
              cancelText="取消">
              <Button type="text">删除</Button>
            </Popconfirm>
          </>
        );
      }
    }
  ];

  return (
    <div className="strategy-box">
      <header>会员等级</header>
      <div className="flexBet">
        <Alert message="会员等级根据从低到高的顺序，自上而下进行排序。" type="info" showIcon style={{ width: 390 }} />
        <Button type="primary" onClick={toAddMemberLevel}>新建会员等级</Button>
      </div>
      <Table columns={columns} dataSource={table} rowKey="id" pagination={false} loading={loading} />
    </div>
  );
}

function MembercardSettingStrategy(props: MembercardSettingStrategyP) {
  return (
    <div className="membercard-setting-strategy">
      <AuthStep cardConfigId={props.cardConfigId} />
      <MemberLevel cardConfigId={props.cardConfigId} />
    </div>
  );
}

export default MembercardSettingStrategy;
