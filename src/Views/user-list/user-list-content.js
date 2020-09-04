import React, { useState, useCallback, useRef, useEffect, useReducer } from 'react';
import { Input, Select, Modal, Alert, Button, message } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import fetch from '@/Api';
import { useRequest } from '@umijs/hooks';
import UserListTable from './user-list-table';

const { getHeadFieldsList, getUserDataList, getAllDomainList, getAllFieldsList, changeDomainFieldsList, toChangeUserFields } = fetch;

const { Option, OptGroup } = Select;

// 修改表格头Modal
function HeadEditModal(props) {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const domainList = useRef(''); // 接口获取的域列表
  const [domainOptions, setDomainOptions] = useState([]); // 过滤后的域选项
  const [userListFieldId, setUserListFieldId] = useState(''); // 字段id
  const fieldsNum = useRef(0); // 已选数量

  const [userFields, setUserFields] = useReducer( // 基础字段值
    (state, action) => {
      const { type, value, i, check } = action;
      switch(type) {
        case 'assign':
          return value;
        case 'update':
          state[i].checked = !check
          return [...state];
        default: 
          throw new Error();
      }
    }
    , []
  );

  const disableDomainList = useCallback(array => { // 过滤域选项disabled
    let selected = array.map(item => item.areaId);
    let arr = [
      {
        label: '会员卡',
        options: [],
      },
      {
        label: '小程序',
        options: [],
      },
      {
        label: '服务号',
        options: [],
      },
    ]
    let domain = domainList.current || [];
    domain.forEach(item => {
      item.disabled = selected.includes(item.areaId) ? true : false;
      item.cuType === 1 && arr[1].options.push(item);
      item.cuType === 2 && arr[2].options.push(item);
      item.cuType === 3 && arr[0].options.push(item);
    })
    setDomainOptions(arr);
  }, [])
  const [domainFields, setDomainFields] = useReducer( // 域字段值
    (state, action) => {
      const { type, value } = action;
      switch (type) {
        case 'assign':
          return value;
        case 'update':
          const { index, i, bool } = value;
          state[index].propNames[i].checked = !bool;
          return [...state];
        case 'changeDomain':
          const { propNames, areaId, domainIndex } = value;
          state[domainIndex].areaId = areaId;
          state[domainIndex].propNames = propNames;
          return [...state];
        case 'delete':
          let arr = [];
          state.forEach((item, sIndex) => {
            sIndex !== value && arr.push(item)
          })
          disableDomainList(arr)
          return [...arr];
        case 'push':
          return [...state, value];
        default:
          throw new Error();
      }
    }
    , []
  );

  const {run: getDomainRun} = useRequest(getAllDomainList, { // 接口：获取所有域选项
    onSuccess: res => {
      domainList.current = res?.result ?? [];
    }
  })
  const {run: getFieldRun} = useRequest(_ => { // 接口：获取表头的数据
    if(!props.userGroupId) return Promise.reject()
    return getAllFieldsList({userGroupId: props.userGroupId})
  }, {
    // refreshDeps: [props.userGroupId],
    onSuccess: res => {
      let { ecuField, cuField, userListFieldId } = res?.result || {};
      setUserFields({ type: 'assign', value: ecuField || [] });
      setDomainFields({ type: 'assign', value: cuField || [] });
      setUserListFieldId(userListFieldId || '');
      // 选中的初始值
      let count = 0;
      ecuField.forEach(item => {
        if(item.checked) count++;
      })
      cuField.forEach(item => {
        item.propNames && item.propNames.forEach(ele => {
          if(ele.checked) count++;
        })
      })
      disableDomainList(cuField || []);
      fieldsNum.current = count;
    }
  })
  const {run: changeFields} = useRequest(toChangeUserFields, // 接口：保存表头编辑
    {
      manual: true,
      onSuccess: _ => {
        setConfirmLoading(false);
        props.closed(true);
        message.success('保存用户列表自定义字段成功');
      }
    }  
  );
  useEffect(_ => { // mounted
    async function getModal() {
      await getDomainRun();
      getFieldRun();
    }
    getModal()
  }, [props.userGroupId, getDomainRun, getFieldRun])

  const handleOk = _ => {
    setConfirmLoading(true);
    let params = {
      areaInfo: [],
      ecuField: [],
      cuField: [],
      userGroupId: props.userGroupId,
      userListFieldId: userListFieldId
    }
    userFields.forEach(item => {
      if(item.checked) {
        if(item.propName.indexOf(',') > -1) {
          let arr = item.propName.split(',');
          arr.forEach(ele => {
            params.ecuField.push({
              propName: ele
            })
          })
        } else {
          params.ecuField.push({
            propName: item.propName
          })
        }
      }
    });
    domainFields.forEach(item => {
      let areaId = item.areaId;
      let domainData = domainList.current?.find(item => item.areaId === areaId);
      let prefix = domainData.prefix;
      let cuType = domainData.cuType;
      let bool = false;
      let array = [];
      item.propNames.forEach(ele => {
        if(ele.checked) {
          bool = true;
          if(ele.propName.indexOf(',') > -1) {
            let arr = ele.propName.split(',');
            arr.forEach(element => {
              array.push({
                propName: `${prefix}.${areaId}.${element}`
              })
            })
          } else {
            array.push({
              propName: `${prefix}.${areaId}.${ele.propName}`
            })
          }
        }
      })
      if(bool) {
        params.cuField.push({
          [areaId]: array
        });
        params.areaInfo.push({
          areaId,
          cuType
        })
      }
    })
    changeFields(params)
  };

  const handleCancel = _ => {
    props.closed(false);
  }

   // 域选项组件
  function DomainBox(props) {
    let domainVal = props.domainVal || {};

    const handleChange = useCallback((val, index) => {
      let num = 0;
      domainFields[index].propNames.forEach(item => item.checked && num++ );
      fieldsNum.current -= num;
      let domainData = (domainList.current || []).find(item => item.areaId === val);
      let cuType = domainData.cuType;
      changeDomainFieldsList({cuType}).then(res => {
        setDomainFields({ type: 'changeDomain', value: { areaId: val, propNames: res.result || [], domainIndex: index } });
        setTimeout(_ =>  disableDomainList(domainFields), 0);
      })
    }, [])

    return (
      <div className="domainBox">
        <div className="upsideOptions">
          <span>
            <span>选择用户域</span>
            <Select defaultValue={domainVal.areaId} style={{ width: 240, marginLeft: 15 }} onChange={val => handleChange(val, props.keyVal)}>
              {
                domainOptions.map(item => {
                  return (
                    <OptGroup label={item.label} key={item.label}>
                      { item.options.map(ele => <Option value={ele.areaId} key={ele.areaId} disabled={ele.disabled}>{ele.name}</Option>) }
                    </OptGroup>
                  )
                })
              }
            </Select>
          </span>
          { props.children }
        </div>
        <div className="underpart">
          {
            domainVal?.propNames?.map((ele, i) => {
              return (
                <div
                  key={i}
                  className={`fieldBox ${ele.checked ? 'active' : ''}`}
                  onClick={_ => changeDomainField(ele.checked, props.keyVal, i)}>
                  {ele.showName}
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }

  const changeUserFieldCheck = useCallback((check, i) => { // 改变普通字段状态
    if(!check && fieldsNum.current >= 8) return message.warning('最多勾选 8 个选项');
    check ? fieldsNum.current-- : fieldsNum.current++;
    setUserFields({ type: 'update', i, check });
  }, [])
  const changeDomainField = useCallback((bool, index, i) => { // 改变域字段状态
    if(!bool && fieldsNum.current >= 8) return message.warning('最多勾选 8 个选项');
    bool ? fieldsNum.current-- : fieldsNum.current++;
    setDomainFields({ type: 'update', value: { index, i, bool } });
  }, [])
  const deleteDomain = useCallback(index => { // 删除域
    let i = 0;
    domainFields[index].propNames.forEach(item => { if(item.checked) i++ });
    fieldsNum.current -= i;
    setDomainFields({ type: 'delete', value: index })
  }, [domainFields])
  const addDomainFieldsOptions = _ => { // 添加一个域
    setDomainFields({ type: 'push', value: { areaId: '', propNames: [] } })
    setTimeout(_ => {
      let maxBox = document.querySelector('.maxBox');
      maxBox.scrollTop = maxBox.scrollHeight;
    }, 0)
  }

  return (
    <Modal
      title="自定义字段列表"
      width="740px"
      visible={props.visible}
      okText="保存"
      cancelText="取消"
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      destroyOnClose>
      <Alert showIcon message={<span>请选择您想显示的列表详细信息，最多勾选 8 个选项，还可以勾选 <span style={{ color: '#2f54ed' }}>{8 - fieldsNum.current}</span> 个</span>} type="info" />
      <div className="maxBox">
        <p>用户字段</p>
        <div className="upBox">
          {
            userFields.map((item, i) => {
              return <div key={i} className={`fieldBox ${item.checked ? 'active' : ''}`} onClick={_ => changeUserFieldCheck(item.checked, i)}>{item.showName}</div>
            })
          }
        </div>
        {
          domainFields.map((item, i) => {
            return (
              <DomainBox key={i} domainVal={item} keyVal={i}>
                {domainFields.length > 1 && <Button type="text" onClick={_ => deleteDomain(i)}>删除</Button>}
              </DomainBox>
            )
          })
        }
        <div className="addBigBtn" onClick={addDomainFieldsOptions}>
          <PlusOutlined style={{ fontSize: 14 }} />
          <span>添加用户域</span>
        </div>
      </div>
    </Modal>
  )
}


function UserContent(props) {
  const [headList, setHeadList] = useState([]);
  const inputData = useRef('');
  const [tableData, setTableData] = useState([]);
  const [total, setTotal] = useState(0);
  const [visible, setVisible] = useState(false);
  const { run: getHeadRun } = useRequest(_ => { // 接口：获取头数据
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
  const { pagination, loading, run: geTableRun } = useRequest( // 接口：获取表格数据
    ({ current, pageSize }) => {
      let params = {
        keyword: inputData.current || undefined,
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

  const onPressEnter = e => { // 回车搜索
    inputData.current = e.target.value;
    geTableRun(pagination)
  }
  const openModal = useCallback((bool, type) => { // 打开/关闭自定义字段
    setVisible(bool);
    type && getHeadRun();
  }, [getHeadRun])

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
      <UserListTable
        loading={loading}
        tableData={tableData}
        headList={headList}
        pagination={pagination}
        total={total}
        openModal={_ => openModal(true)}/>
      {
        visible && <HeadEditModal userGroupId={props.groupId} visible={visible} closed={type => openModal(false, type)} />
      }
    </div>
  )
}

export default UserContent;