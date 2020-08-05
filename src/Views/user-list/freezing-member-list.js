import React, { useState, useLayoutEffect } from 'react';
import { Table, Pagination, Button } from 'antd';
import { useRequest } from '@umijs/hooks';
import fetch from '@/Api';
import '@/Style/freezing-member-list.scss';

const { queryFreezingList } = fetch;

const bread = [
  {
    name: '冻结会员列表'
  }
]

function FreezingMemberList(props) {
  const [tableData, setTableData] = useState([]);
  const [total, setTotal] = useState(0);
  const { loading, pagination } = useRequest(({ current, pageSize }) => {
    let params = {
      pageNum: current,
      pageSize: pageSize,
      freezeStatus: 2
    }
    return queryFreezingList(params)
  }, {
    paginated: true,
    defaultPageSize: 20,
    onSuccess: res => {
      const { totalCount, result } = res.result || {};
      setTotal(totalCount ? Number(totalCount) : 0);
      let table = [];
      (result || []).forEach(item => {
        if(item.mcuInfo && item.mcuInfo.length) {
          let len = item.mcuInfo.length;
          item.mcuInfo.forEach((ele, i) => {
            ele.id = item.id;
            ele.rowSpan = i === 0 ? len : 0;
            table.push(ele);
          })
        }
      })
      setTableData(table);
    }
  })

  useLayoutEffect(() => {
    props.bread(bread);
  }, [props])

  const columns = [
    {
      title: '用户ID',
      dataIndex: 'id',
      render: (_, row) => {
        return {
          children: row.id,
          props: {
            rowSpan: row.rowSpan
          }
        }
      }
    },
    {
      title: '会员卡信息',
      dataIndex: 'name',
    },
    {
      title: '会员等级',
      dataIndex: 'gradeName',
    },
    {
      title: '会员卡名称',
      dataIndex: 'cardConfName',
    },
    {
      title: '积分余额',
      dataIndex: 'effectiveIntegral',
    },
    {
      title: '冻结次数',
      dataIndex: 'freezeTime',
    },
    {
      title: '最新冻结原因',
      dataIndex: 'freezeReason',
    },
    {
      title: '操作',
      key: 'options',
      render: _ => {
        return (
          <>
            <Button type="text">查看</Button>
            <Button type="text">解冻</Button>
          </>
        )
      }
    },
  ];

  return (
    <div className="routeContent freezingMemberList">
      <header>
        
      </header>
      <Table columns={columns} dataSource={tableData} loading={loading} pagination={false} rowKey={record => record.mcuId} />
      <Pagination
        {...pagination}
        showSizeChanger
        total={total}
        onShowSizeChange={pagination.onChange}
        style={{
          marginTop: 16,
          textAlign: 'right',
        }} />
    </div>
  )
}

export default FreezingMemberList;