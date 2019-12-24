import React from 'react'
import Routes from 'routes'
import { History } from 'history'

import { IonContent, IonPage, IonList, IonItem, IonLabel, IonInput, IonButton } from '@ionic/react'
import { Header } from 'components'

export type Props = {
  history: History
}

class Component extends React.Component<Props> {

  state = { code: null, password: null, name: null }

  onChange = (e: any) => {
    const { name, value } = e.target
    this.setState({ ...this.state, [name]: value })
  }

  onSubmit = (e: any) => {
    e.preventDefault()
    const { code, password } = this.state
    if (code && password) {
      this.props.history.push(Routes.home.path)
    }
  }

  render() {
    const { code, password, name } = this.state
    return (
      <IonPage>
        <Header />
        <IonContent className="ion-padding">
          <form onSubmit={this.onSubmit}>
            <IonList lines="full" className="ion-no-margin ion-no-padding">
              <IonItem>
                <IonLabel position="floating">Verification code</IonLabel>
                <IonInput onIonChange={this.onChange} value={code} type="text" name="code" autocomplete="off" />
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Password you will use</IonLabel>
                <IonInput onIonChange={this.onChange} value={password} type="text" name="password" autocomplete="off" />
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Your name</IonLabel>
                <IonInput onIonChange={this.onChange} value={name} type="text" name="name" autocomplete="off" />
              </IonItem>
            </IonList>
            <div className="ion-padding">
              <IonButton expand="block" type="submit" className="ion-no-margin">Submit</IonButton>
            </div>
          </form>
        </IonContent>
      </IonPage>
    )
  }

}

export default Component
