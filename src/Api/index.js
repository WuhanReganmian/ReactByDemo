import getFetch from './getFetch.js';

let api = {
  login: '/login', // 登录
  getEnterprise: '/list-enterprise-by-phone', // 根据电话号码查商户
}

api = getFetch(api, '/gic-auth-web');

export default {
  ...api
}