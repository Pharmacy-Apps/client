import React from 'react'
import Routes from 'routes'
import { History } from 'history'

import { IonContent, IonPage, IonList, IonItem, IonLabel, IonInput, IonButton } from '@ionic/react'
import { Header } from 'components'

export type Props = {
  history: History
}

class Component extends React.Component<Props> {

  state = { phone: null }

  onChange = (e: any) => {
    const { name, value } = e.target
    this.setState({ ...this.state, [name]: value })
  }

  onSubmit = (e: any) => {
    e.preventDefault()
    const { phone } = this.state
    if (phone) {
      this.props.history.push(Routes.signup2.path)
    }
  }

  render() {
    const { phone } = this.state
    return (
      <IonPage>
        <Header omitsBack />
        <IonContent className="ion-padding">
          <form onSubmit={this.onSubmit}>
            <IonList lines="full" className="ion-no-margin ion-no-padding">
              <IonItem>
                <IonLabel position="floating">Phone</IonLabel>
                <IonInput onIonChange={this.onChange} value={phone} type="tel" name="phone" autocomplete="off" />
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
