import { Signup1, Signup2, Login, Home, Order, Credit, Account } from 'pages'

interface Routes {
  [key: string]: {
    path: string,
    component: Function,
    isPublic?: boolean
  }
}

const routes: Routes = {
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

export default routes