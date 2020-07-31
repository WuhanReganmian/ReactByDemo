import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Input, Select, Table, Popover, Pagination } from 'antd';
import { SearchOutlined, SettingOutlined } from '@ant-design/icons';
import fetch from '@/Api';
import defaultImg from '@/Images/member_img.png';
import { useRequest } from '@umijs/hooks';

const { getHeadFieldsList, getUserDataList, getUserInfo } = fetch;

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
const filterMultiData = (mergeShowPropName, propData) => { // 带图片的数据
  let manyFields = mergeShowPropName.split(',');
  let showData = '';
  manyFields.forEach(item => {
    let dataStr;
    if(item.indexOf('.') !== -1) {
      let arr = item.split('.');
      for(let i = 0; i < arr.length; i++) {
        if(!dataStr) {
          dataStr = propData[arr[i]];
        } else {
          dataStr = dataStr[arr[i]];
        }
      }
      dataStr = dataStr || '';
    } else {
      dataStr = propData[item] || '';
    }
    if(/^http|image\/png/.test(dataStr)) {
      showData += `<img src="${dataStr}" style="width:40px;height:40px;margin-right:8px;border-radius:2px" alt="" />`;
    } else if(dataStr){
      showData += `<div style="flex:1;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${dataStr}</div>`
    } else if(!showData){
      showData += '--'
    }
  })
  return '<div style="display:flex;align-items:center">' + showData + '</div>';
}

function UserPopover(props) { // 用户信息弹框
  const [infoData, setInfoData] = useState({});

  const popContent = useCallback(_ => {
    return (
      <>
        <div className="popoverEcuStyle">
          <img src={infoData.headUrl} className="popImg" alt="" />
          <div className="infoDetail">
            <div className="firstRow">
              <span>{ infoData.name || '--' }</span>
              <span>{ infoData.sex || '--' }</span>
              <span>{ infoData.age || '--' }岁</span>
            </div>
            <div>
              <i className="el-icon-location-outline" style={{marginRight: 10, fontSize: 16}}></i>
              <span>{ infoData.residentCity || '--' }</span>
            </div>
            <div>
              <i className="font_family icon-mobile" style={{marginRight: 10, fontSize: 16}}></i>
              <span>{ infoData.phone || '--' }</span>
            </div>
          </div>
        </div>
        <div className="popoverCardStyle">
          <div className="numCard">
            <div>
              <span style={{fontSize: 24, marginRight: 5}}>{ infoData.memberCardNum || 0 }</span>
              <span>张</span>
            </div>
            <div>会员卡</div>
          </div>
          <div className="numCard">
            <div>
              <span style={{fontSize: 24, marginRight: 5}}>{ infoData.serviceNum || 0 }</span>
              <span>个</span>
            </div>
            <div>公众号</div>
          </div>
          <div className="numCard">
            <div>
              <span style={{fontSize: 24, marginRight: 5}}>{ infoData.appletsNum || 0 }</span>
              <span>个</span>
            </div>
            <div>小程序</div>
          </div>
        </div>
      </>
    )
  }, [infoData])
  const onVisibleChange = useCallback((visible, propData) => {
    visible && getUserInfo({ ecuId: propData.id }).then(res => {
      const { result = {} } = res || {};
      result.headUrl = result.headUrl || defaultImg;
      setInfoData(result);
    })
  }, [])

  return (
    <Popover
      content={popContent}
      mouseEnterDelay={0.3}
      onVisibleChange={visible => onVisibleChange(visible, props.propData)}
      destroyTooltipOnHide
      overlayStyle={{width: 250}}>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <img src={props.propData.headUrl_n} className="popImg1" alt="" />
        <span className="showEllipsis" style={{color: '#606266', flex: 1}}>{ filterData(props.type.name, props.propData) }</span>
      </div>
    </Popover>
  )
}

function DataDealing(props) { // 判断表格内容
  let type = props.type;
  let row = {
    ...props.row,
    headUrl_n: props.row.headUrl_n || defaultImg
  };
  if(!type.popout && !type.mergeShowPropName && !type.copy) {
    return filterData(type.name, row)
  } else if(!type.popout && !type.mergeShowPropName && type.copy) {
    return <Link to={`/user-list/user-detail`}>{ filterData(type.name, row) }</Link>
  } else if (!type.popout && type.mergeShowPropName) {
    let html = {__html: filterMultiData(type.mergeShowPropName, row)}
    return <div dangerouslySetInnerHTML={ html }></div>;
  } else if (type.popoutCode === 'ecuInfo') {
    return <UserPopover propData={row} type={type} />
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
  const head = useRequest(_ => { // 获取头数据
    return getHeadFieldsList({ userGroupId: props.groupId })
  }, {
    refreshDeps: [props.groupId],
    onSuccess: res => {
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
    }
  })
  const { pagination, loading } = useRequest( // 获取表格数据
    ({ current, pageSize }) => {
      let params = {
        keyword: undefined,
        userGroupId: props.groupId,
        currentPage: current,
        pageSize,
      }
      if(!props.groupId) return Promise.reject();
      return getUserDataList(params)
    },
    {
      paginated: true,
      defaultPageSize: 20,
      refreshDeps: [props.groupId],
      onSuccess: res => {
        const { totalNumber, ecuIndex } = res.result || {};
        setTotal(totalNumber ? Number(totalNumber) : 0);
        setTableData(ecuIndex || []);
      }
    }
  )

  const getHeadBody = _ => { // 表格渲染
    return headList.map(item => (
      !item.showHead ?
        <Column
          title={item.showName}
          key={`${item.name}-${+new Date()}`}
          ellipsis
          render={row => <DataDealing row={row} type={item} />} />
        : <ColumnGroup title={item.headName} key={`${item.showName}-${+new Date()}`}>
            {
              item.colName && item.colName.length && item.colName.map(ele => {
                return <Column
                  title={ele.showName}
                  key={`${ele.name}-${+new Date()}`}
                  ellipsis
                  render={row => <DataDealing row={row} type={ele} />} />
              })
            }
          </ColumnGroup>
    ));
  }
  const onPressEnter = e => { // 回车搜索

  }

  const lastTitle = ( // 自定义表头
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>操作</div>
      <SettingOutlined style={{fontSize: 20, cursor: 'pointer'}} />
    </div>
  )

  return (
    <div className="userContent">
      <header className="contentHeader">用户共 {total} 人</header>
      <nav>
        <Input
          prefix={<SearchOutlined />}
          placeholder="请输入用户姓名/会员卡号/手机号/用户ID进行搜索"
          style={{ width: 370 }}
          allowClear
          onPressEnter={onPressEnter} />
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
        rowSelection={{
          type: "checkbox"
        }}
        dataSource={tableData}
        rowKey={record => record.id}
        loading={loading}>
        { getHeadBody() }
        <Column
          title={lastTitle}
          render={row => (
            <Link to={`/user-list/user-detail?ecuId=${row.id}`}>查看</Link>
          )} />
      </Table>
      <Pagination
        {...pagination}
        showQuickJumper
        showSizeChanger
        onShowSizeChange={pagination.onChange}
        style={{
          marginTop: 16,
          textAlign: 'right',
        }} />
    </div>
  )
}

export default UserContent;