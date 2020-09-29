import React, { useCallback } from 'react';
import { Tooltip } from 'antd';

interface MembercardP {
  activeBox: string;
  cardConfigId: string;
  cardName: string;
  type: number;
  gradeCount: number;
  click(): any;
}

interface MembercardListP {
  table: any[];
  activeBox: string;
  changeActive(_: string): any;
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
            {/* 暂时懒得写 */}
          </span>
        </div>
      </div>
    </div>
  );
}

function MembercardList(props: MembercardListP) {
  const onClickCard = useCallback((id: string) => {
    props.changeActive(id);
    // eslint-disable-next-line
  }, []);

  return (
    <div className="membercard-list">
      <header>会员卡列表</header>
      {
        props.table.map(item => {
          return (
            <MemberCard
              key={item.cardConfigId}
              activeBox={props.activeBox}
              cardConfigId={item.cardConfigId}
              cardName={item.cardName}
              type={item.type}
              gradeCount={item.gradeCount}
              click={() => onClickCard(item.cardConfigId)} />
          );
        })
      }
    </div>
  );
}

export default MembercardList;
