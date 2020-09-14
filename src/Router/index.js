import { lazy } from 'react';

const UserList = lazy(_ => import('@/Views/user-list/user-list.js'));
const FreezingMemberList = lazy(_ => import('@/Views/user-list/freezing-member-list.js'));
const UserDetail = lazy(_ => import('@/Views/user-list/user-detail.js'));
const MembercardSettingList = lazy(_ => import('@/Views/member-card-config/membercard-setting-list.js'));

const routes = [
  { path: '/user-list/user-list', component: UserList },
  { path: '/user-list/freezing-member-list', component: FreezingMemberList },
  { path: '/user-list/user-detail/:ecuId', component: UserDetail },
  { path: '/member-system/membercard-setting-list', component: MembercardSettingList },
]

export default routes;