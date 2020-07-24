import React, { useState, useLayoutEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Input, Select, Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import fetch from '@/Api';

const { getHeadFieldsList, getUserDataList } = fetch;

const { Option } = Select;
// eslint-disable-next-line
const { Column, ColumnGroup } = Table;

const filterData = (name, propData) => { // 过滤数据
  if(!name) return '--';
  if(name.indexOf('.') !== -1) {
    let arr = name.split('.');
    let dataStr = '没值';
    for(let i = 0; i < arr.length; i++) {
      if(dataStr === '没值') {
        dataStr = propData[arr[i]];
      } else if(!dataStr) {
        return '--';
      } else {
        dataStr = dataStr[arr[i]];
      }
    }
    return dataStr || '--';
  } else {
    return propData[name] || '--';
  }
}

function DataDealing(props) { // 判断表格内容
  let type = props.type;
  if(!type.popout && !type.mergeShowPropName && !type.copy) {
    return filterData(type.name, props.row)
  } else if(!type.popout && !type.mergeShowPropName && type.copy) {
    return <Link to={`/user-list/user-detail`}>{ filterData(type.name, props.row) }</Link>
  }
   else {
    return '--'
  }
}

function UserContent(props) {
  const [headList, setHeadList] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [total, setTotal] = useState(0);
  // eslint-disable-next-line
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20 });

  const getHeadList = useCallback(userGroupId => { // 获取头数据
    getHeadFieldsList({userGroupId}).then(res => {
      let list = res.result || [];
      let headData = []
      list.forEach(item => {
        if(!item.showHead) {
          item.colName.forEach(ele => {
            headData.push(ele)
          })
        } else {
          headData.push(item)
        }
      })
      setHeadList(headData)
    })
  }, [])

  const getTableData = useCallback(userGroupId => { // 获取表格数据
    if(!userGroupId) return;
    let params = {
      keyword: undefined,
      userGroupId,
      currentPage: 1,
      pageSize: 20,
      // sortField: this.sortField,
      // sortType: this.sortType
    };
    getUserDataList(params).then(res => {
      const { totalNumber, ecuIndex } = res.result || {};
      setTotal(totalNumber ? Number(totalNumber) : 0);
      setTableData(ecuIndex || []);
    })
  }, [])

  useLayoutEffect(_ => { // created
    getHeadList(props.groupId);
    getTableData(props.groupId)
  }, [props.groupId, getHeadList, getTableData])

  const getHeadBody = _ => { // 表格渲染
    return headList.map(item => (
      !item.showHead &&
      <Column
        title={item.showName}
        key={`${item.name}-${+new Date()}`}
        render={row => <DataDealing row={row} type={item} />} />
    ));
  }

  return (
    <div className="userContent">
      <header className="contentHeader">用户共 {total} 人</header>
      <nav>
        <Input prefix={<SearchOutlined />} placeholder="请输入用户姓名/会员卡号/手机号/用户ID进行搜索" style={{ width: 370 }} />
        <Select style={{ width: 150 }} placeholder="批量操作">
          <Option value="1">调整积分</Option>
          <Option value="2">调整会员等级</Option>
          <Option value="3">修改服务门店</Option>
          <Option value="4">增加协管门店</Option>
          <Option value="5">批量导出会员</Option>
          <Option value="6">修改归属品牌</Option>
          <Option value="7">修改归属渠道</Option>
        </Select>
      </nav>
      <Table
        // columns={headList}
        dataSource={tableData}
        rowKey={record => record.id}
        // loading={loading}
        pagination={pagination}>
        { getHeadBody() }
      </Table>
    </div>
  )
}

export default UserContent;