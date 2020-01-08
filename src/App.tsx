import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { IonApp, IonRouterOutlet } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'

import Routes from './routes'

import { Signup1, Signup2, Login, Home1, Home2, Account } from './pages'
import { Progress, Toast } from './components'
import { sessionAvailable } from './session'

import { watchPosition as watchUserLocation } from 'location'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'

/* Theme variables */
import './theme/variables.css'

export default class App extends React.Component {

  componentWillMount() {
    watchUserLocation()
  }

  componentWillUnmount() { /* clear location watch */ }

  render() {
    return (
      <IonApp>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route path="/*" render={
              () => <Redirect to={sessionAvailable() ? Routes.home.path : Routes.login.path} />
            } />
            <Route path={Routes.signup1.path} render={props => <Signup1 {...props} />} />
            <Route path={Routes.signup2.path} render={props => <Signup2 {...props} />} />
            <Route path={Routes.login.path} render={props => <Login {...props} />} />
            <Route path={Routes.home.path} render={props => <Home1 {...props} />} />
            <Route path={Routes.search.path} render={props => <Home2 {...props} />} />
            <Route path={Routes.account.path} render={props => <Account {...props} />} />
          </IonRouterOutlet>
        </IonReactRouter>
        <Progress />
        <Toast />
      </IonApp>
    )
  }

}
