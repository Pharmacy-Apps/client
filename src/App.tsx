import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { IonApp, IonRouterOutlet } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'

import { Signup1, Signup2, Login, Home } from './pages'
import { sessionAvailable } from './session'

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

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/*" render={
          () => <Redirect to={sessionAvailable() ? '/home' : '/login'} />
        } />
        <Route path="/signup1" render={props => <Signup1 {...props} />} />
        <Route path="/signup2" render={props => <Signup2 {...props} />} />
        <Route path="/login" render={props => <Login {...props} />} />
        <Route path="/home" render={() => <Home />} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
)

export default App
