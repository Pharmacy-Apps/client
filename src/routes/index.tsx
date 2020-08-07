import decrypt from 'utils/jwt'
import { getSessionToken, clearSession } from 'session'

import { Signup1, Signup2, Login, Home, Search, Order, Credit, Account } from 'pages'

interface Routes {
  [key: string]: {
    path: string,
    component: Function,
    isPublic?: boolean
  }
}

const Routes: Routes = {
  courier: {
    path: '/courier',
    component: Home
  },
  admin: {
    path: '/admin',
    component: Home
  },
  home: {
    path: '/',
    component: Home
  },
  account: {
    path: '/account',
    component: Account
  },
  search: {
    path: '/search',
    component: Search
  },
  order: {
    path: '/order',
    component: Order
  },
  credit: {
    path: '/credit',
    component: Credit
  },
  signup1: {
    path: '/signup1',
    component: Signup1,
    isPublic: true
  },
  signup2: {
    path: '/signup2',
    component: Signup2,
    isPublic: true
  },
  login: {
    path: '/login',
    component: Login,
    isPublic: true
  }
}

export default Routes

const RoutesIndexedOnRoles = [
  Routes.home.path,
  Routes.courier.path,
  Routes.admin.path,
  Routes.admin.path
]

export const getDefaultRoute = (token = getSessionToken()) => {
  const role = decrypt(token).role
  if (role === undefined) { // Force logout for old client
    clearSession()
    window.location.reload()
  }
  return RoutesIndexedOnRoles[role - 1]
}