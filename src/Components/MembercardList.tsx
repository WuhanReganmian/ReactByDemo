import React from 'react';
import { Tooltip } from 'antd';

interface MembercardP {
  activeBox: string;
  cardConfigId: string;
  cardName: string;
  type: number;
  gradeCount: number;
  click(): any;
}

function MemberCard(props: MembercardP) {
  return (
    <div className={`cardBox ${props.activeBox === props.cardConfigId ? 'active' : '' }`} onClick={props.click}>
      <div className="head">
        <span style={{ flex: 1, fontSize: 13 }}>{ props.cardName || '--' }</span>
        <span className="state-point state-point-success" style={{ color: '#606266', fontSize: 12 }}>正常</span>
      </div>
      <div className="content">
        <div>
          <Tooltip placement="topLeft" title={<div>自有：表示商户自己创建的会员卡；<br /> 共享：表示由联合商户授权给自己的会员卡；</div>}>
            <span className="tooltip-icon">会员卡类型</span>
          </Tooltip>：
          <span style={{ color: '#303133' }}>{ props.type === 1 ? '自有' : props.type === 2 ? '共享' : '--' }</span>
        </div>
        <div>
          会员卡等级：
          <span style={{ color: '#303133' }}>{ props.gradeCount || '--' }</span>
          <span className="editBtn">
            {/* <dm-perm-button v-if="!isStrategy" type="text" size="small" style="float:right" @click="editBtn(props)" :disabled="$itemPerm($itemCode.membercardEditBtn)">编辑</dm-perm-button>
            <el-button v-else type="text" size="small" style="float:right" @click="editBtn(props)">删除</el-button> */}
          </span>
        </div>
      </div>
    </div>
  );
}

function MembercardList() {

  const changeMembercard = () => {};

  return (
    <div className="membercard-list">
      <header>会员卡列表</header>
      <MemberCard
        activeBox={'123'}
        cardConfigId={'123'}
        cardName={'123'}
        type={1}
        gradeCount={1}
        click={changeMembercard} />
    </div>
  );
}

export default MembercardList;
