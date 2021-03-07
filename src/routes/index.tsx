import decrypt from 'utils/jwt'
import { getSessionToken, clearSession } from 'session'

import {
  Signup1, Signup2, Login, Home,
  Search, Item, Order, Pay, Location,
  Requests, Request, Credit, Account,
  About, TCs
} from 'pages'

interface Routes {
  [key: string]: {
    path: string,
    component: Function,
    isPublic?: boolean,
    preventRedirect?: true
  }
}

const Routes: Routes = {
  courier: {
    path: '/courier',
    component: Home
  },
  admin: {
    path: '/admin',
    component: Requests
  },
  home: {
    path: '/',
    component: Home
  },
  about: {
    path: '/about',
    component: About,
    isPublic: true,
    preventRedirect: true
  },
  tcs: {
    path: '/terms-conditions',
    component: TCs,
    isPublic: true,
    preventRedirect: true
  },
  account: {
    path: '/account',
    component: Account
  },
  search: {
    path: '/search',
    component: Search
  },
  item: {
    path: '/item',
    component: Item
  },
  order: {
    path: '/order',
    component: Order
  },
  pay: {
    path: '/pay',
    component: Pay
  },
  location: {
    path: '/location',
    component: Location
  },
  requests: {
    path: '/requests',
    component: Requests
  },
  request: {
    path: '/request',
    component: Request
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