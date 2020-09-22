import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Table, Popover, Pagination } from 'antd';
import { SettingOutlined, EnvironmentOutlined, TabletOutlined } from '@ant-design/icons';
import defaultImg from 'src/Images/member_img.png';
import fetch from 'src/Api';
import { useRequest } from '@umijs/hooks';
import { HeadArr } from './user-list-content';

const { getUserInfo } = fetch;
const { Column, ColumnGroup } = Table;

interface PopProp {
  propData: IterateS;
  type: any;
  headUrl_n?: string;
}

interface DealingV {
  type: IterateS;
  row: IterateS;
}

interface TableList {
  headList: HeadArr;
  openModal: () => any;
  tableData: any[];
  loading: boolean;
  pagination: any;
  total: number;
}

const filterData = (name: string, propData: IterateS) => { // 过滤数据
  if (!name) return '--';
  if (name.indexOf('.') !== -1) {
    let arr: IterateS = name.split('.');
    let dataStr = '没值';
    for (let key in arr) {
      if (dataStr === '没值') {
        dataStr = propData[arr[key]];
      } else if (!dataStr) {
        return '--';
      } else {
        dataStr = dataStr[arr[key]];
      }
    }
    return dataStr || '--';
  } else {
    return propData[name] || '--';
  }
};

const filterMultiData = (mergeShowPropName: string, propData: IterateS): string => { // 带图片的数据
  let manyFields = mergeShowPropName.split(',');
  let showData = '';
  manyFields.forEach(item => {
    let dataStr;
    if (item.indexOf('.') !== -1) {
      let arr = item.split('.');
      for (let key in arr) {
        if (!dataStr) {
          dataStr = propData[arr[key]];
        } else {
          dataStr = dataStr[arr[key]];
        }
      }
      dataStr = dataStr || '';
    } else {
      dataStr = propData[item] || '';
    }
    if (/^http|image\/png/.test(dataStr)) {
      showData += `<img src="${dataStr}" style="width:40px;height:40px;margin-right:8px;border-radius:2px" alt="" />`;
    } else if (dataStr) {
      showData += `<div style="flex:1;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${dataStr}</div>`;
    } else if (!showData) {
      showData += '--';
    }
  });
  return '<div style="display:flex;align-items:center">' + showData + '</div>';
};

// 用户信息弹框
function UserPopover(props: PopProp) {
  const [infoData, setInfoData] = useState<IterateS>({});
  const { run: getInfoRun } = useRequest(getUserInfo, { // 获取信息
    manual: true,
    onSuccess: (res: ApiRes) => {
      setInfoData(res?.result || {});
    }
  });

  const popContent = useCallback(() => {
    return (
      <>
        <div className="popoverEcuStyle">
          <img src={infoData?.headUrl || defaultImg} className="popImg" alt="" />
          <div className="infoDetail">
            <div className="firstRow">
              <span>{ infoData.name || '--' }</span>
              <span>{ infoData.sex || '--' }</span>
              <span>{ infoData.age || '--' }岁</span>
            </div>
            <div>
              <EnvironmentOutlined style={{marginRight: 10, fontSize: 16}} />
              <span>{ infoData.residentCity || '--' }</span>
            </div>
            <div>
              <TabletOutlined style={{marginRight: 10, fontSize: 16}} />
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
    );
  }, [infoData]);
  const onVisibleChange = useCallback((visible, propData) => {
    visible && getInfoRun({ ecuId: propData.id });
  }, [getInfoRun]);

  return (
    <Popover
      content={popContent}
      mouseEnterDelay={0.3}
      onVisibleChange={visible => onVisibleChange(visible, props.propData)}
      destroyTooltipOnHide
      overlayStyle={{width: 250}}>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <img src={props.propData?.headUrl_n || defaultImg} className="popImg1" alt="" />
        <span className="showEllipsis" style={{color: '#606266', flex: 1}}>{ filterData(props.type.name, props.propData) }</span>
      </div>
    </Popover>
  );
}

// 判断表格内容
function DataDealing(props: DealingV) {
  let type = props.type;
  let row = props.row;
  if (!type.popout && !type.mergeShowPropName && !type.copy) {
    return <div style={{ whiteSpace: 'pre-line' }}>{ filterData(type.name, row) }</div>;
  } else if (!type.popout && !type.mergeShowPropName && type.copy) {
    return <Link to={`/user-list/user-detail`}>{ filterData(type.name, row) }</Link>;
  } else if (!type.popout && type.mergeShowPropName) {
    let html = {__html: filterMultiData(type.mergeShowPropName, row)};
    return <div dangerouslySetInnerHTML={ html }></div>;
  } else if (type.popoutCode === 'ecuInfo') {
    return <UserPopover propData={row} type={type} />;
  }
   else {
    return <span>--</span>;
  }
}

function UserListTable(props: TableList) {
  // 表格渲染
  const getHeadBody = () => {
    return (props.headList || []).map((item: any) => (
      !item.showHead ?
        <Column
          title={item.showName}
          key={`${item.name}-${+new Date()}`}
          ellipsis
          render={row => <DataDealing row={row} type={item} />} />
        : <ColumnGroup title={item.headName} key={`${item.showName}-${+new Date()}`}>
            {
              item.colName && item.colName.length && item.colName.map((ele: any) => {
                return <Column
                  title={ele.showName}
                  key={`${ele.name}-${+new Date()}`}
                  ellipsis
                  render={row => <DataDealing row={row} type={ele} />} />;
              })
            }
          </ColumnGroup>
    ));
  };
  // 自定义表头
  const lastTitle = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>操作</div>
      <SettingOutlined style={{fontSize: 20, cursor: 'pointer'}} onClick={props.openModal} />
    </div>
  );

  return (
    <div className="user-list-table">
      <Table
        rowSelection={{
          type: "checkbox"
        }}
        dataSource={props.tableData}
        rowKey={record => record.id}
        pagination={false}
        loading={props.loading}>
        { getHeadBody() }
        <Column
          title={lastTitle}
          render={row => (
            <Link to={`/user-list/user-detail/${row.id}`}>查看</Link>
          )} />
      </Table>
      <Pagination
        {...props.pagination}
        showSizeChanger
        total={props.total}
        onShowSizeChange={props.pagination.onChange}
        style={{
          marginTop: 16,
          textAlign: 'right'
        }} />
    </div>
  );
}

export default UserListTable;
