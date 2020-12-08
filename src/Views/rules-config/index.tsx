import React, { useCallback, useLayoutEffect } from 'react';
import { Button, Input, Space, Table, Modal, message } from 'antd';
import { SearchOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import 'src/Style/rules-config.scss';
import { useRequest } from '@umijs/hooks';
import fetch from "src/Api";
import { useHistory } from 'react-router-dom';

const { queryAutoCardStrategyList, delAutoCardStrategyData } = fetch;
const { confirm } = Modal;

const bread = [{ name: '系统规则配置' }];

/* 自动开卡策略 */
function AutoOpenCardStrategy() {
  const history = useHistory();
  const { data, loading, run } = useRequest(queryAutoCardStrategyList, {
    formatResult: (res: ApiRes) => res.result || []
  });

  const columns: ColumnV[] = [
    {
      title: '策略名称',
      key: 'name',
      dataIndex: 'name'
    },
    {
      title: '操作',
      key: 'id',
      dataIndex: 'id',
      render: (id: string) => {
        return (
          <>
            <Button type="text">编辑</Button>
            <Button type="text" onClick={() => del(id)}>删除</Button>
          </>
        );
      }
    }
  ];

  const del = useCallback((id: string) => {
    confirm({
      title: '确定要删除该策略么?',
      icon: <ExclamationCircleOutlined />,
      content: 'Some descriptions',
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        delAutoCardStrategyData({ strategyId: id }).then(() => {
          message.success('删除成功');
          run();
        });
      }
    });
    // eslint-disable-next-line
  }, []);

  const toCreate = () => {
    history.push('/commodity/create-card-strategy');
  };

  return (
    <div className="strategy-box">
      <header>自动开卡策略</header>

      <nav>
        <Input prefix={<SearchOutlined />} placeholder="请输入策略名称" style={{ width: 300 }} />
        <Space>
          <Button>开卡失败日志</Button>
          <Button type="primary" onClick={() => toCreate()}>新建自动开卡策略</Button>
        </Space>
      </nav>

      <Table columns={columns} dataSource={data} loading={loading} pagination={false} rowKey="id" />
    </div>
  );
}

function RulesConfig(props: P) {

  useLayoutEffect(() => {
    props.bread(bread);
  }, [props]);

  return (
    <div className="rules-config">
      <AutoOpenCardStrategy />
    </div>
  );
}

export default RulesConfig;
