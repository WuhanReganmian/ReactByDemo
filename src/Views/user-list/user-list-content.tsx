import React, { useState, useCallback, useRef, useEffect, useReducer, useMemo } from 'react';
import { Input, Select, Modal, Alert, Button, message } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import fetch from 'src/Api';
import { useRequest } from '@umijs/hooks';
import UserListTable from './user-list-table';

const { getHeadFieldsList, getUserDataList, getAllDomainList, getAllFieldsList, changeDomainFieldsList, toChangeUserFields } = fetch;

const { Option, OptGroup } = Select;

interface HeadModalP {
  userGroupId: string;
  visible: boolean;
  closed(v: boolean, b?: boolean): void;
}

interface FieldV {
  checked: boolean;
  propName: string;
  showName: string;
}
type EcuF = FieldV[];

interface BaseReducerV {
  type: string;
  value?: any;
  i?: number;
  check?: boolean;
}

interface DomainReducerV {
  type: string;
  value?: any;
  bool?: boolean;
  propNames?: any;
  areaId?: string;
  domainIndex?: number;
}

interface DomainFieldV {
  areaId: string;
  propNames: EcuF;
}
type CuF = DomainFieldV[];

interface DomainV {
  areaId: string;
  name: string;
  prefix: string;
  cuType: number;
  disabled?: boolean;
}

interface DomainOptionV {
  label: string;
  options: DomainV[];
}

interface DBoxP {
  keyVal: number;
  domainVal: any;
  children?: any;
}

interface UserContentP {
  groupId: string;
}

interface HeadColV {
  copy: boolean;
  name: string;
  popout: boolean;
  popoutParamNames: string;
  showName: string;
  sort: boolean;
  popoutCode: string | null;
}

interface HeadListV {
  showHead: boolean;
  headName: string | null;
  type: number;
  colName: HeadColV[];
}
export type HeadArr = (HeadColV | HeadListV)[];

// 修改表格头Modal
function HeadEditModal(props: HeadModalP) {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const domainList = useRef<DomainV[]>([]); // 接口获取的域列表
  const [userListFieldId, setUserListFieldId] = useState<string>(''); // 字段id

  const [userFields, setUserFields] = useReducer(// 基础字段值
    (state: EcuF, action: BaseReducerV) => {
      const { type, value, i, check } = action;
      switch (type) {
        case 'assign':
          return value;
        case 'update':
          state[(i as number)].checked = !check;
          return [...state];
        default:
          throw new Error();
      }
    }
    , []
  );

  const [domainFields, setDomainFields] = useReducer(// 域字段值
    (state: CuF, action: DomainReducerV) => {
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
          let arr = state.filter((_, sIndex) => sIndex !== value);
          return [...arr];
        case 'push':
          return [...state, value];
        default:
          throw new Error();
      }
    }
    , []
  );

  const fieldsNum = useMemo<number>(() => { // 已选字段数量
    let count = 0;
    userFields.forEach((item: FieldV)  => {
      if (item.checked) count++;
    });
    domainFields.forEach((item: DomainFieldV) => {
      item.propNames && item.propNames.forEach((ele: FieldV) => {
        if (ele.checked) count++;
      });
    });
    return count;
    }, [domainFields, userFields]);

  const domainOptions = useMemo<DomainOptionV[]>(() => { // 过滤后的域选项
    let selected = domainFields.map((item: DomainFieldV) => item.areaId);
    let arr: DomainOptionV[] = [
      {
        label: '会员卡',
        options: []
      },
      {
        label: '小程序',
        options: []
      },
      {
        label: '服务号',
        options: []
      }
    ];
    let domain = domainList.current || [];
    domain.forEach(item => {
      item.disabled = selected.includes(item.areaId) ? true : false;
      item.cuType === 1 && arr[1].options.push(item);
      item.cuType === 2 && arr[2].options.push(item);
      item.cuType === 3 && arr[0].options.push(item);
    });
    return arr;
  }, [domainFields, domainList]);

  const {run: getDomainRun} = useRequest(getAllDomainList, { // 接口：获取所有域选项
    onSuccess: res => {
      domainList.current = res?.result ?? [];
    }
  });
  const {run: getFieldRun} = useRequest(() => { // 接口：获取表头的数据
    if (!props.userGroupId) return Promise.reject();
    return getAllFieldsList({userGroupId: props.userGroupId});
  }, {
    // refreshDeps: [props.userGroupId],
    onSuccess: res => {
      let { ecuField, cuField, userListFieldId } = res?.result || {};
      setUserFields({ type: 'assign', value: ecuField || [] });
      setDomainFields({ type: 'assign', value: cuField || [] });
      setUserListFieldId(userListFieldId || '');
    }
  });
  const {run: changeFields} = useRequest(toChangeUserFields, // 接口：保存表头编辑
    {
      manual: true,
      onSuccess: () => {
        setConfirmLoading(false);
        props.closed(true);
        message.success('保存用户列表自定义字段成功');
      }
    }
  );

  useEffect(() => { // mounted
    if (props.visible) {
      getDomainRun();
      getFieldRun();
    }
    // eslint-disable-next-line
  }, [props.userGroupId, props.visible]);

  const handleOk = () => {
    setConfirmLoading(true);
    let params: any = {
      areaInfo: [],
      ecuField: [],
      cuField: [],
      userGroupId: props.userGroupId,
      userListFieldId
    };
    userFields.forEach((item: FieldV) => {
      if (item.checked) {
        if (item.propName.indexOf(',') > -1) {
          let arr = item.propName.split(',');
          arr.forEach(ele => {
            params.ecuField.push({
              propName: ele
            });
          });
        } else {
          params.ecuField.push({
            propName: item.propName
          });
        }
      }
    });
    domainFields.forEach((item: DomainFieldV) => {
      let areaId = item.areaId;
      let domainData = domainList.current?.find((item: DomainV) => item.areaId === areaId);
      let prefix = (domainData as DomainV).prefix;
      let cuType = (domainData as DomainV).cuType;
      let bool = false;
      let array: any[] = [];
      item.propNames.forEach(ele => {
        if (ele.checked) {
          bool = true;
          if (ele.propName.indexOf(',') > -1) {
            let arr = ele.propName.split(',');
            arr.forEach(element => {
              array.push({
                propName: `${prefix}.${areaId}.${element}`
              });
            });
          } else {
            array.push({
              propName: `${prefix}.${areaId}.${ele.propName}`
            });
          }
        }
      });
      if (bool) {
        params.cuField.push({
          [areaId]: array
        });
        params.areaInfo.push({
          areaId,
          cuType
        });
      }
    });
    changeFields(params);
  };

  const handleCancel = () => {
    props.closed(false);
  };

   // 域选项组件
  function DomainBox(props: DBoxP) {
    let domainVal = props.domainVal || {};

    const handleChange = useCallback((val, index) => {
      let num = 0;
      domainFields[index].propNames.forEach((item: FieldV) => item.checked && num++);
      let domainData = (domainList.current || []).find(item => item.areaId === val);
      let cuType = (domainData as DomainV).cuType;
      changeDomainFieldsList({cuType}).then((res: ApiRes) => {
        setDomainFields({ type: 'changeDomain', value: { areaId: val, propNames: res.result || [], domainIndex: index } });
      });
    }, []);

    return (
      <div className="domainBox">
        <div className="upsideOptions">
          <span>
            <span>选择用户域</span>
            <Select defaultValue={domainVal.areaId} style={{ width: 240, marginLeft: 15 }} onChange={val => handleChange(val, props.keyVal)}>
              {
                domainOptions.map((item: DomainOptionV) => {
                  return (
                    <OptGroup label={item.label} key={item.label}>
                      { item.options.map((ele: DomainV) => <Option value={ele.areaId} key={ele.areaId} disabled={ele.disabled}>{ele.name}</Option>) }
                    </OptGroup>
                  );
                })
              }
            </Select>
          </span>
          { props.children }
        </div>
        <div className="underpart">
          {
            domainVal?.propNames?.map((ele: FieldV, i: number) => {
              return (
                <div
                  key={i}
                  className={`fieldBox ${ele.checked ? 'active' : ''}`}
                  onClick={() => changeDomainField(ele.checked, props.keyVal, i)}>
                  {ele.showName}
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }

  const changeUserFieldCheck = useCallback((check: boolean, i: number) => { // 改变普通字段状态
    if (!check && fieldsNum >= 8) return message.warning('最多勾选 8 个选项');
    setUserFields({ type: 'update', i, check });
    // eslint-disable-next-line
  }, []);
  const changeDomainField = useCallback((bool: boolean, index: number, i: number) => { // 改变域字段状态
    if (!bool && fieldsNum >= 8) return message.warning('最多勾选 8 个选项');
    setDomainFields({ type: 'update', value: { index, i, bool } });
    // eslint-disable-next-line
  }, []);
  const deleteDomain = useCallback((index: number) => { // 删除域
    setDomainFields({ type: 'delete', value: index });
  }, []);
  const addDomainFieldsOptions = () => { // 添加一个域
    setDomainFields({ type: 'push', value: { areaId: '', propNames: [] } });
    setTimeout(() => {
      let maxBox = document.querySelector('.maxBox');
      (maxBox as Element).scrollTop = (maxBox as Element).scrollHeight;
    }, 0);
  };

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
      <Alert showIcon message={<span>请选择您想显示的列表详细信息，最多勾选 8 个选项，还可以勾选 <span style={{ color: '#2f54ed' }}>{8 - fieldsNum}</span> 个</span>} type="info" />
      <div className="maxBox">
        <p>用户字段</p>
        <div className="upBox">
          {
            userFields.map((item: FieldV, i: number) => {
              return <div key={i} className={`fieldBox ${item.checked ? 'active' : ''}`} onClick={_ => changeUserFieldCheck(item.checked, i)}>{item.showName}</div>;
            })
          }
        </div>
        {
          domainFields.map((item: DomainFieldV, i: number) => {
            return (
              <DomainBox key={i} domainVal={item} keyVal={i}>
                {domainFields.length > 1 && <Button type="text" onClick={() => deleteDomain(i)}>删除</Button>}
              </DomainBox>
            );
          })
        }
        <div className="addBigBtn" onClick={addDomainFieldsOptions}>
          <PlusOutlined style={{ fontSize: 14 }} />
          <span>添加用户域</span>
        </div>
      </div>
    </Modal>
  );
}


function UserContent(props: UserContentP) {
  const [headList, setHeadList] = useState<HeadArr>([]);
  const inputData = useRef<string>('');
  const [tableData, setTableData] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);
  const { run: getHeadRun } = useRequest(() => { // 接口：获取头数据
    if (!props.groupId) return Promise.reject();
    return getHeadFieldsList({ userGroupId: props.groupId });
  }, {
    refreshDeps: [props.groupId],
    onSuccess: (res: ApiRes) => {
      let list = res.result || [];
      let headData: HeadArr = [];
      list.forEach((item: HeadListV) => {
        if (!item.showHead) {
          item.colName.forEach((ele: HeadColV) => {
            headData.push(ele);
          });
        } else {
          headData.push(item);
        }
      });
      setHeadList(headData);
    }
  });
  const { pagination, loading, run: geTableRun } = useRequest(// 接口：获取表格数据
    ({ current, pageSize }) => {
      let params = {
        keyword: inputData.current || undefined,
        userGroupId: props.groupId,
        currentPage: current,
        pageSize
      };
      if (!props.groupId) return Promise.reject();
      return getUserDataList(params);
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
  );

  const onPressEnter = (e: any) => { // 回车搜索
    inputData.current = e.target.value;
    geTableRun(pagination);
  };
  const openModal = useCallback((bool: boolean, type?: boolean | undefined) => { // 打开/关闭自定义字段
    setVisible(bool);
    type && getHeadRun();
  }, [getHeadRun]);

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
        openModal={() => openModal(true)}/>

      <HeadEditModal userGroupId={props.groupId} visible={visible} closed={type => openModal(false, type)} />
    </div>
  );
}

export default UserContent;
