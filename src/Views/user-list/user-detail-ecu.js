import React, { useState } from 'react';
import { useRequest } from '@umijs/hooks';
import { Form, Radio, Table, Tooltip } from 'antd';
import fetch from '@/Api';
import defaultImg from '@/Images/member_img.png';

const { getEcuUserDetail } = fetch;

function EcuDetail(props) {
  const [baseInfo, setBaseInfo] = useState({})
  const [tabChoose, setTabChoose] = useState('1')
  const [tableData, setTableData] = useState([])
  // const [assistStore, setAssistStore] = useState('')
  // const [defaultFields, setDefaultFields] = useState({})
  // const [userFields, setUserFields] = useState({})

  // eslint-disable-next-line
  const { run: getListRun } = useRequest(_ => {
    if(!props.ecuId) return Promise.reject();
    return getEcuUserDetail({ ecuId: props.ecuId })
  }, {
    onSuccess: res => {
      let result = res?.result || {}
      setBaseInfo(result);
      // eslint-disable-next-line
      const { master, system, custom } = result;
      const { list = [], assistStore = '' } = master;
      let arr = (list || []).map((item, i) => { // 合并表格
        return {
          ...item,
          key: i,
          assistStore: assistStore || ''
        }
      })
      if(!arr.length && assistStore) {
        arr.push({ key: '1', assistStore: assistStore })
      }
      setTableData(arr);
      // setAssistStore(master?.assistStore || '');
      // defaultFields = system || [];
      // userFields = custom || [];
    }
  })

  const radioChange = e => { // tab栏切换
    setTabChoose(e.target.value || '1');
  }
  const columns = [ // 表格
    {
      title: '品牌',
      dataIndex: 'brandName',
      key: 'brandName'
    },
    {
      title: '服务门店',
      dataIndex: 'store',
      key: 'store'
    },
    {
      title: '专属导购',
      dataIndex: 'guide',
      key: 'guide'
    },
    {
      title: '协管门店',
      dataIndex: 'assistStore',
      key: 'assistStore',
      render: (text, row, index) => {
        return {
          children: (
            <Tooltip title={text} placement="top">
              <div className="ellipsis">{text}</div>
            </Tooltip>
          ),
          props: { rowSpan: tableData.length },
        };
      }
    }
  ];
  
  return (
    <div className="ecu-detail detailPulic">
      <header>用户信息</header>
      <div className="basics">
        <div className="basics-left">
          <Form>
            <Form.Item label="姓名">{baseInfo.name || '--'}</Form.Item>
            <Form.Item label="性别">{baseInfo.sex || '--'}</Form.Item>
            <Form.Item label="出生日期">{baseInfo.birthday || '--'}</Form.Item>
          </Form>
          <Form>
            <Form.Item label="昵称">{baseInfo.nickName || '--'}</Form.Item>
            <Form.Item label="年龄">{baseInfo.age || '--'}</Form.Item>
            <Form.Item label="常驻城市">{baseInfo.city || '--'}</Form.Item>
          </Form>
        </div>
        <div className="basics-right">
          <img src={baseInfo?.imgUrl || defaultImg} alt="" />
        </div>
      </div>
      <div className="detail">
        <Radio.Group defaultValue="1" onChange={radioChange} style={{ marginBottom: 20 }}>
          <Radio.Button value="1">归属信息</Radio.Button>
          <Radio.Button value="2">系统默认字段</Radio.Button>
          <Radio.Button value="3">自定义字段</Radio.Button>
        </Radio.Group>
        { tabChoose === '1' && <Table dataSource={tableData} columns={columns} pagination={false} /> }
      </div>
    </div>
  )
}

export default EcuDetail;