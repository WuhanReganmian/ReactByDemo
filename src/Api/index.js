import getFetch from './getFetch.js';

let api = {
  login: '/login', // 登录
  getEnterprise: '/list-enterprise-by-phone', // 根据电话号码查商户
  getMenuList: '/login-user-menu', // 头部菜单
}

api = getFetch(api, '/gic-auth-web');

export default {
  ...api
}