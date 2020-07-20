import {lazy} from 'react';

const UserList = lazy(_ => import('@/Views/user-list/user-list.js'))

const routes = [
  { path: '/user-list/user-list', component: UserList }
]

export default routes;