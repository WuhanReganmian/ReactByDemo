import React, { useState, Suspense, useEffect, lazy } from 'react';
import 'src/Style/layout.scss';
import routes from 'src/Router';
import fetch from 'src/Api';
import { HashRouter as Router, Switch, Route, Redirect, useHistory } from 'react-router-dom';
import { useRequest } from '@umijs/hooks';
import { Breadcrumb } from 'antd';
import { headConfig } from 'src/Config';
import Loading from '../Loading';

const { getMenuList, getUserDetail } = fetch;

const AsideMenu = lazy(() => import('./AsideMenu'));
const Head = lazy(() => import('./Head'));

interface BreadV {
  name: string;
  href?: string;
}

function Layout() {
  const [menuCheck, setMenuCheck] = useState<number>(20000);
  const [bread, setBread] = useState<BreadV[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // 阻止路由组件在请求头数据获取之前渲染
  const history = useHistory();

  const { data: menuList } = useRequest(getMenuList, { formatResult: data => data.result || [] }); // 接口：获取菜单
  useRequest(getUserDetail, { // 接口：获取请求头数据
    onSuccess: (res: ApiRes) => {
      const { enterpriseId } = res.result || {};
      headConfig.sign = enterpriseId;
      headConfig.route = history.location.pathname;
      setLoading(true);
    }
  });

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
      <Suspense fallback={<Loading />}>
        <Head menu={menuList} menuCheck={menuCheck} onChange={onChangeNav} />
      </Suspense>
      <div className="layoutContent">
        <Suspense fallback={<Loading />}>
          <AsideMenu menu={menuList} menuCheck={menuCheck} />
        </Suspense>
        <div className="layoutContext">
          <div className="breadCrumb">
            <Breadcrumb separator=">">
              {
                bread.map(item => <Breadcrumb.Item key={item.name} {...item}>{item.name}</Breadcrumb.Item>)
              }
            </Breadcrumb>
          </div>
          <div className="routeBackground">
            {
              loading &&
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
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
