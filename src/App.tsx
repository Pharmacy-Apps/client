import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { IonApp, IonRouterOutlet } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'

import Routes, { getDefaultRoute } from './routes'

import { WebSplashScreen } from './pages'
import { Progress, Toast } from './components'
import { sessionAvailable } from './session'

import { watchPosition as watchUserLocation } from 'location'

import { platformIsWeb } from 'utils'

import 'worker'
import 'tasks/index'

import 'styles'

// For public pages, redirect to  default home if session available
const fn1 = (Component: Function, props: any, preventRedirect = false) =>
  sessionAvailable() && preventRedirect === false
    ? <Redirect to={getDefaultRoute()} />
    : <Component {...props} />

// For protected pages, redirect to /login if session not available
const fn2 = (Component: Function, props: any) => sessionAvailable()
  ? <Component {...props} />
  : <Redirect to={Routes.login.path} />

const routeValues = Object.values(Routes)

const appIsWebDeployed = platformIsWeb && window.location.hostname !== 'localhost'

const splashTimeout = 800

export default class App extends React.Component {

  state = { renderSplashScreen: appIsWebDeployed }

  componentDidMount() {
    if (this.routeNotFound()) window.location.replace(Routes.home.path)
    if (appIsWebDeployed) setTimeout(this.hideSpashScreen, splashTimeout)
    watchUserLocation()
  }

  componentWillUnmount() { /* clear location watch */ }

  routeNotFound = () => {
    const currentPath = window.location.pathname
    return routeValues.map(({ path }) => path).indexOf(currentPath) < 0
  }

  hideSpashScreen = () => {
    this.setState({ renderSplashScreen: false })
  }

  render() {
    return (
      <IonApp>{
        this.state.renderSplashScreen
          ? <WebSplashScreen />
          : <>
            <IonReactRouter>
              <IonRouterOutlet>{
                routeValues.map(({ path, component: Component, isPublic, preventRedirect }, i) => (
                  <Route exact key={i} path={path} render={
                    props => isPublic ? fn1(Component, props, preventRedirect) : fn2(Component, props)
                  } />
                ))
              }</IonRouterOutlet>
            </IonReactRouter>
            <Progress />
            <Toast />
          </>
      }</IonApp>
    )
  }

}
