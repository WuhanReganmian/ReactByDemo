import getFetch from './getFetch';

let api = {
  login: '/login', // 登录
  logout: '/logout', // 退出登录
  getEnterprise: '/list-enterprise-by-phone', // 根据电话号码查商户
  getMenuList: '/login-user-menu', // 头部菜单
  getUserDetail: '/get-login-user-info' // 获取用户信息
};
let api1 = {
  /* 用户列表 */
  queryGroupList: {
    url: '/query-user-group-list', // 查询该企业下所有用户组
    method: 'post'
  },
  getAdminGroupList: {
    url: '/get-user-group-list', // 获取管理员用户组信息
    method: 'post',
    useFormData: true
  },
  addGroupList: {
    url: '/save-user-group-info', // 用户分组新增
    method: 'post'
  },
  checkGroupLimit: {
    url: '/edit-user-group', // 是否有用户组编辑权限
    method: 'post'
  },
  delGroupList: {
    url: '/del-user-group-info', // 删除用户组
    method: 'post'
  },
  getGroupDetail: {
    url: '/get-user-group-info', // 获取用户分组信息
    method: 'post'
  },
  saveGroupList: {
    url: '/update-user-group-info', // 用户分组修改
    method: 'post'
  },
  getHeadFieldsList: {
    url: '/query-user-list-head-info', // 获取用户列表头信息
    method: 'post'
  },
  getUserDataList: {
    url: '/query-cu-index-info', // 获取用户列表数据
    method: 'post'
  },
  getUserInfo: {
    url: '/ecu-popout-info', // 用户信息弹框
    method: 'post'
  },
  queryFreezingList: {
    url: '/query-member-freeze-list', // 获取冻结列表
    method: 'post'
  },
  getAllDomainList: {
    url: '/query-all-area-info', // 获取配置用户列表域
    method: 'post',
    useFormData: true
  },
  getAllFieldsList: {
    url: '/get-user-list-field', // 自定义字段查询
    method: 'post'
  },
  changeDomainFieldsList: {
    url: '/get-cu-user-field', // 获取某个域自定义用户字段信息
    method: 'post',
    useFormData: true
  },
  toChangeUserFields: {
    url: '/save-user-list-field', // 保存用户列表自定义字段
    method: 'post'
  },
  /* 用户详情 */
  getEcuUserDetail: {
    url: '/select-ECU-detail', // 获取ECU详情
    method: 'post',
    useFormData: true
  },
  /* 会员卡配置 */
  queryMembercardList: '/card-config/get-list', // 会员卡分页查询
  queryMembercardStrategyList: '/scene/get-card-strategy', // 获取单张卡开卡场景
  /* 会员等级 */
  queryMemberLevelList: {
    url: '/query-grade-config-list', // 获取等级列表
    method: 'post',
    useFormData: true
  },
  delMemberLevelList: {
    url: '/del-grade-config', // 逻辑删除
    method: 'post',
    useFormData: true
  }
};

let doApi = getFetch(api, '/gic-auth-web', 'damo-system');
let doApi1 = getFetch(api1, '/member-config', 'memberfour');

export default {
  ...doApi,
  ...doApi1
};
