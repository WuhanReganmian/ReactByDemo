import React, { useCallback, useState, useLayoutEffect, useEffect } from 'react';
import { Menu } from 'antd';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const { SubMenu } = Menu;

function AsideMenu(props) {
  const [menuData, setMenuData] = useState([]);
  const [title, setTitle] = useState([]);
  const [rootSubmenuKeys, setRootSubmenuKeys] = useState([]);
  const [openKey, setOpenKey] = useState([]);
  const [defaultKey, setDefaultKey] = useState([]);
  const [routeData, setrouteData] = useState([]); // 储存可能跳转的菜单
  let history = useHistory();

  useLayoutEffect(_ => {
    const menu = props.menu || [];
    const data = menu.find(item => item.menuId === Number(props.menuCheck)) || {};
    setTitle(data.menuName);
    let menuChild = (data.children || []).filter(item => item.isShow === 1);
  
    const rootSubmenuKeys = menuChild.map(item => item.menuId.toString()); // 可展开菜单
  
    const roudata = [];
    menuChild.forEach(ele => {
      if(ele.children && ele.children.length) {
        ele.children = ele.children.filter(item => item.isShow === 1);
        roudata.push(...ele.children);
      }
      !ele.children.length && roudata.push(ele);
    });
    setrouteData(roudata)
    setMenuData(menuChild)
    setRootSubmenuKeys(rootSubmenuKeys)
  }, [props.menu, props.menuCheck])

  useEffect(_ => { // 第一次进来默认选中
    const defaultCheck = routeData.find(item => item.menuUrl === history.location.pathname);
    let defaultKeys = defaultCheck ? [ defaultCheck.menuId.toString() ] : []
    console.log(defaultKeys)
    setDefaultKey(defaultKeys)
  }, [routeData, history.location.pathname])

  const onClick = useCallback(({ key }) => {
    const link = routeData.find(item => item.menuId.toString() === key);
    link && history.push(link.menuUrl);
  }, [routeData, history]);

  const onOpenChange = openKeys => { // 点击菜单，收起其他展开的所有菜单
    console.log(openKeys)
    const latestOpenKey = openKeys.find(key => openKey.indexOf(key) === -1);
    console.log(latestOpenKey)
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKey(openKeys)
    } else {
      setOpenKey(latestOpenKey ? [latestOpenKey] : [])
    }
  };

  return (
    <div className="asideMenu">
      <h3 className="asideMenuTitle">{ title }</h3>
      <Menu
        mode="inline"
        onClick={onClick}
        openKeys={openKey}
        selectedKeys={defaultKey}
        onOpenChange={onOpenChange}
        style={{ width: '100%' }}>
        {
          menuData.map(item => {
            if(item.children && item.children.length) {
              return (
                <SubMenu key={item.menuId} title={item.menuName}>
                  {
                    item.children.map(ele => {
                      return <Menu.Item key={ele.menuId}>{ ele.menuName }</Menu.Item>
                    })
                  }
                </SubMenu>
              )
            } else {
              return <Menu.Item key={item.menuId}>{ item.menuName }</Menu.Item>
            }
          })
        }
      </Menu>
    </div>
  )
}

export default AsideMenu;