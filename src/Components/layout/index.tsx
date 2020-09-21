import React, { useState, Suspense } from 'react';
import Head from './Head';
import AsideMenu from './AsideMenu';
import 'src/Style/layout.scss';
import routes from 'src/Router';
import fetch from 'src/Api';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { useRequest } from '@umijs/hooks';
import { Breadcrumb, Spin } from 'antd';

const { getMenuList } = fetch;

interface BreadV {
  name: string;
  href?: string;
}

// 加载中转个圈
function Loading() {
  return (
    <div style={{ width: '100%', height: 500, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Spin />
    </div>
  );
}

function Layout() {
  const [menuCheck, setMenuCheck] = useState<number>(20000);
  const [bread, setBread] = useState<BreadV[]>([]);
  const { data: menuList } = useRequest(getMenuList, { formatResult: data => data.result || [] }); // 接口：获取菜单

  const onChangeNav = (id: number) => {
    setMenuCheck(id);
  };

  const changeBread = (data: BreadV[]) => {
    setBread(data || []);
  };

  return (
    <div className="layoutClass">
      <Head menu={menuList} menuCheck={menuCheck} onChange={onChangeNav} />
      <div className="layoutContent">
        <AsideMenu menu={menuList} menuCheck={menuCheck} />
        <div className="layoutContext">
          <div className="breadCrumb">
            <Breadcrumb separator=">">
              {
                bread.map(item => <Breadcrumb.Item key={item.name} {...item}>{item.name}</Breadcrumb.Item>)
              }
            </Breadcrumb>
          </div>
          <div className="routeBackground">
            <div className="routeContent">
              <Suspense fallback={<Loading />}>
                <Router>
                  <Switch>
                    {
                      routes?.map(item => {
                        return (
                          <Route
                            key={item.path}
                            path={item.path}
                            render={props => <item.component bread={changeBread} {...props} />} />
                        );
                      })
                    }
                    <Redirect to='/404' />
                  </Switch>
                </Router>
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
