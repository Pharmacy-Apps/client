import React from 'react'
import Routes from 'routes'
import { History } from 'history'

import { IonContent, IonPage } from '@ionic/react'
import { Header } from 'components'

export type Props = {
  history: History,
}

const toolbarActions = (history: History) => [{
  component: 'Account',
  handler: () => history.push(Routes.account.path)
}]

const Component: React.FC<Props> = props => {
  return (
    <IonPage>
      <Header omitsBack title="Requests" actions={toolbarActions(props.history)} />
      <IonContent className="ion-padding">
        Oyster
      </IonContent>
    </IonPage>
  )
}

export default Component
