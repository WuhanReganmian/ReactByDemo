import React, {useState, useEffect} from 'react';
import Head from './Head';
import AsideMenu from './AsideMenu'
import '@/Style/layout.scss'
import fetch from '@/Api';

const { getMenuList } = fetch;

function Layout() {
  const [menuList, setMenuList] = useState([]);
  const [menuCheck, setMenuCheck] = useState(20000)

  useEffect(() => {
    getMenuList().then(res => {
      setMenuList(res.result);
    })
  }, [])

  const onChangeNav = id => {
    console.log(id)
    setMenuCheck(id)
  }

  return (
    <div className="layoutClass">
      <Head menu={menuList} menuCheck={menuCheck} onChange={onChangeNav} />
      <div className="layoutContent">
        <AsideMenu menu={menuList} menuCheck={menuCheck} />
      </div>
    </div>
  )
}

export default Layout;