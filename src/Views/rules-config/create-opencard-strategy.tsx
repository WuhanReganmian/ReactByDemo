import React, { useEffect } from 'react';

const bread = [{ name: '系统规则配置', href: '#/member-system/rules-config' }, { name: '新建自动开卡策略' }];

function CreateOpencardStrategy(props: P) {

  useEffect(() => {
    props.bread(bread);
    // eslint-disable-next-line
  }, [bread]);
  return (
    <div>123</div>
  );
}

export default CreateOpencardStrategy;
