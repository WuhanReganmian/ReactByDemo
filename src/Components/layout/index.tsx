import React, { useState, Suspense, useEffect } from 'react';
import Head from './Head';
import AsideMenu from './AsideMenu';
import 'src/Style/layout.scss';
import routes from 'src/Router';
import fetch from 'src/Api';
import { HashRouter as Router, Switch, Route, Redirect, useHistory } from 'react-router-dom';
import { useRequest } from '@umijs/hooks';
import { Breadcrumb, Spin } from 'antd';

const { getMenuList, getUserDetail } = fetch;

interface BreadV {
  name: string;
  href?: string;
}

export let headConfig = {
  sign: '',
  route: ''
};

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
  const { data: menuList, run: getMenuRun } = useRequest(getMenuList, { formatResult: data => data.result || [], manual: true }); // 接口：获取菜单
  const history = useHistory();

  useEffect(() => { // 先获取数据添加进请求头
    async function init() {
      await getUserDetail().then((res: ApiRes) => {
        const { enterpriseId } = res.result || {};
        headConfig.sign = enterpriseId;
        headConfig.route = history.location.pathname;
      });
      getMenuRun();
    }
    init();
    // eslint-disable-next-line
  }, []);

  useEffect(() => { // 路由变化时更改请求头数据
    history.listen(routes => {
      headConfig.route = routes.pathname;
    });
  }, [history]);

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
