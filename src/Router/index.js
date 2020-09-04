import { lazy } from 'react';

const UserList = lazy(_ => import('@/Views/user-list/user-list.js'));
const FreezingMemberList = lazy(_ => import('@/Views/user-list/freezing-member-list.js'));
const UserDetail = lazy(_ => import('@/Views/user-list/user-detail.js'));

const routes = [
  { path: '/user-list/user-list', component: UserList },
  { path: '/user-list/freezing-member-list', component: FreezingMemberList },
  { path: '/user-list/user-detail', component: UserDetail },
]

export default routes;