import React, { useCallback, useState, useLayoutEffect, useEffect } from 'react';
import { Menu } from 'antd';
import { useHistory } from 'react-router-dom';

const { SubMenu } = Menu;

interface HeadProp {
  menu: UrlVal;
  menuCheck: number;
}

interface UrlVal extends IterateS {
  isShow: number;
  menuId: number;
  parentId: number;
  level: number;
  menuUrl: string;
  children: ArrUrl;
}

type ArrUrl = UrlVal[];

// const getAllData = (arr: ArrUrl) => { // 递归获取所有路由
//   return arr.reduce((pre, val) => {
//     return pre.concat(val, getAllData(val?.children || []))
//   }, [])
// }

const getUrl = (arr: ArrUrl, path: string, option = 'menuUrl'): UrlVal | undefined => { // 递归找到子路由，并返回最近可显示的父路由
  for (let key of arr) {
    if (key[option] && path.includes(key[option].toString())) {
      return key;
    }
    if (key?.children?.length) {
      let data = getUrl(key.children, path, option);
      if (data && data.isShow) return data;
      if (data) return key;
    }
  }
  return undefined;
};

function AsideMenu(props: HeadProp) {
  const [menuData, setMenuData] = useState<ArrUrl>([]); // 左侧菜单可显示数据
  const [title, setTitle] = useState<ArrUrl>([]);
  const [rootSubmenuKeys, setRootSubmenuKeys] = useState<string[]>([]); // 可展开菜单
  const [openKey, setOpenKey] = useState<string[]>([]); // 组件已展开的菜单
  const [defaultKey, setDefaultKey] = useState<string[]>([]); // 选中的菜单
  const [routeData, setrouteData] = useState<ArrUrl>([]); // 储存所有的菜单
  let history = useHistory();

  useLayoutEffect(() => {
    const data = props.menu?.find((item: UrlVal) => item.menuId === Number(props.menuCheck)) ?? {};
    setTitle(data.menuName);
    let menuChild = (data.children || []).filter((item: UrlVal) => item.isShow === 1);

    const rootSubmenuKeys = menuChild.map((item: UrlVal) => item.menuId.toString()); // 可展开菜单

    // const roudata = getAllData(menuChild);
    setrouteData(menuChild);

    menuChild = menuChild.map((item: UrlVal) => ({ // 过滤应该显示的菜单
      ...item,
      children: item.children.filter((i: UrlVal) => i.isShow)
    }));
    setMenuData(menuChild);
    setRootSubmenuKeys(rootSubmenuKeys);
  }, [props.menu, props.menuCheck]);

  useEffect(() => { // 默认选中
    const check = getUrl(routeData, history.location.pathname);
    if (!(check as undefined)) return;
    setDefaultKey([ (check as UrlVal)?.menuId.toString() ]);

    if (!openKey?.length && (check as UrlVal).level > 2 && (check as UrlVal).isShow) { // 第一次进来或者刷新，如果是子菜单则展开
      setOpenKey([ (check as UrlVal)?.parentId.toString() ]);
    }
    // 不依赖openkey
    // eslint-disable-next-line
  }, [routeData, history.location.pathname]);

  const onClick = useCallback(({ key }) => {
    const link = getUrl(menuData, key.toString(), 'menuId');
    if (link && !history.location.pathname.includes(link.menuUrl)) { // 防止重复点击
      history.push(link.menuUrl);
      link?.level < 3 && setOpenKey([]);
    }
    // eslint-disable-next-line
  }, [routeData]);

  const onOpenChange = (openKeys: any) => { // 点击菜单，收起其他展开的所有菜单
    const latestOpenKey = openKeys.find((key: string) => openKey.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey as string) === -1) {
      setOpenKey(openKeys);
    } else {
      setOpenKey(latestOpenKey ? [latestOpenKey] : []);
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
            if (item?.children?.length) {
              return (
                <SubMenu key={item.menuId} title={item.menuName}>
                  {
                    item.children.map((ele: UrlVal) => {
                      return <Menu.Item key={ele.menuId}>{ ele.menuName }</Menu.Item>;
                    })
                  }
                </SubMenu>
              );
            } else {
              return <Menu.Item key={item.menuId}>{ item.menuName }</Menu.Item>;
            }
          })
        }
      </Menu>
    </div>
  );
}

export default AsideMenu;
