import { lazy } from 'react';

// 会员列表
const UserList = lazy(() => import('src/Views/user-list/user-list'));
const UserDetail = lazy(() => import('src/Views/user-list/user-detail'));

// 冻结列表
const FreezingMemberList = lazy(() => import('src/Views/user-list/freezing-member-list'));

// 会员配置
const MembercardSettingList = lazy(() => import('src/Views/member-card-config/membercard-setting-list'));

const routes = [
  { path: '/user-list/user-list', component: UserList },
  { path: '/user-list/freezing-member-list', component: FreezingMemberList },
  { path: '/user-list/user-detail/:ecuId', component: UserDetail },
  { path: '/member-system/membercard-setting-list', component: MembercardSettingList }
];

export default routes;
