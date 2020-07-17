import React, { useCallback } from 'react';
import { Menu, Dropdown } from 'antd'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function Options(props) {
  let arr = props.value;
  return (
    <Menu
      onClick={props.onClick}
      selectable={false}
      theme="dark">
      {
        arr.map(item => {
          return (
            item.isShow === 1 &&
            <Menu.Item key={item.menuId}>
              { item.menuName }
            </Menu.Item>
          )
        })
      }
    </Menu>
  )
}

function Head(props) {
  let arr = props.menu || [];
  let history = useHistory();

  const onClick = useCallback((item, { key }) => { // 子选项跳转
    const { children, menuId } = item;
    props.onChange(menuId);
    // eslint-disable-next-line
    let data = children.find(ele => ele.menuId == key);
    if(data && data.menuUrl) {
      history.push(data.menuUrl);
    } else if(data.children && data.children.length) {
      history.push(data.children[0].menuUrl);
    }
  }, [history, props])

  const onClickMenu = useCallback(item => { // 菜单跳转
    const { menuUrl, children, menuId } = item;
    props.onChange(menuId);
    if(menuUrl) {
      history.push(menuUrl);
    } else if(children && children.length) {
      history.push(children[0].menuUrl);
    }
  }, [history, props])

  return (
    <div className="headClass">
      <img src="assets/menu-logo-2.png" alt="" />
      {
        arr.map((item, index) => {
          return (
            item.isShow === 1 &&
            (item.children ? 
              <Dropdown
                overlay={() => <Options onClick={(key) => onClick(item, key)} value={item.children} />}
                placement="bottomLeft"
                key={item.menuId}>
                <div className={`menuItem ${item.menuId === props.menuCheck ? 'menuCheck' : ''}`} onClick={() => onClickMenu(item)}>{ item.menuName }</div>
              </Dropdown>
              : <div className={`menuItem ${item.menuId === props.menuCheck ? 'menuCheck' : ''}`} key={index} onClick={() => onClickMenu(item)}>{ item.menuName }</div>)
          )
        })
      }
    </div>
  )
}

export default Head;