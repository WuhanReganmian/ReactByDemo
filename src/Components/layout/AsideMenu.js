import React, { useCallback } from 'react';
import { Menu } from 'antd';

const { SubMenu } = Menu;

function Options(props) {
  let children = props.children;
  return (
    <>
      {
        children && children.length &&
          children.map(item => {
            return <Menu.Item key={item.menuId}>{ item.menuName }</Menu.Item>
          })
      }
    </>
  )
}

function AsideMenu(props) {
  let menu = props.menu || [];

  const onClick = useCallback(({ key }) => {
    console.log(key)
  }, []);

  return (
    <div className="asideMenu">
      <Menu
        mode="inline"
        onClick={onClick}
        style={{ width: '100%' }}>
        {
          menu.map(item => {
            return (
              <SubMenu key={item.menuId} title={item.menuName}>
                <Options option={item.children} />
              </SubMenu>
            )
          })
        }
      </Menu>
    </div>
  )
}

export default AsideMenu;