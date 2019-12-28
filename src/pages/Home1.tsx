import React from 'react'
import Routes from 'routes'
import { History } from 'history'

import { IonContent, IonPage, IonButton } from '@ionic/react'
import { Header } from 'components'

export type Props = {
  history: History
}

const primaryAction = 'Action' // 'Request for Meds'
const placeholderText = 'Placeholder Text'

const requests = []

class Component extends React.Component<Props> {

  state = { searchStr: null }

  onPrimaryAction = () => { this.props.history.push(Routes.search.path) }

  toolbarActions = () => {
    const { history } = this.props
    return [{
      component: 'Account',
      handler: () => history.push(Routes.account.path)
    }]
  }

  render() {
    return (
      <IonPage>
        <Header omitsBack title="Requests" actions={this.toolbarActions()} />
        {<IonContent>
          {requests.length ? <div className="ion-padding">
            Requests
          </div> : <div className="ion-padding">{
              placeholderText
            }</div>}
          <div className="ion-padding">
            <IonButton onClick={this.onPrimaryAction} className="ion-no-margin">{primaryAction}</IonButton>
          </div>
        </IonContent>}
      </IonPage>
    )
  }

}

export default Component
