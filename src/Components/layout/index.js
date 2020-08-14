import React, {useState, Suspense} from 'react';
import Head from './Head';
import AsideMenu from './AsideMenu';
import '@/Style/layout.scss';
import routes from '@/Router';
import fetch from '@/Api';
import { HashRouter as Router, Switch, Route } from 'react-router-dom/cjs/react-router-dom.min';
import { useRequest } from '@umijs/hooks';
import { Breadcrumb } from 'antd';

const { getMenuList } = fetch;

function Layout() {
  const { data: menuList } = useRequest(getMenuList, { formatResult: data => data.result || [] })
  const [menuCheck, setMenuCheck] = useState(20000);
  const [bread, setBread] = useState([])

  const onChangeNav = id => {
    setMenuCheck(id)
  }

  const changeBread = data => {
    setBread(data || [])
  }

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
            <Suspense fallback={<div>Loading</div>}>
              <Router>
                <Switch>
                  {
                    routes?.map(item => {
                      return (
                        <Route
                          key={item.path}
                          path={item.path}
                          render={props => <item.component bread={changeBread} {...props} />} />
                      )
                    })
                  }
                </Switch>
              </Router>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout;