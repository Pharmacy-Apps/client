import React from 'react'
import { IonContent, IonPage } from '@ionic/react'

import { Header } from 'components'

const Component: React.FC = () => {
  return (
    <IonPage>
      <Header title="Select destination" />
      <IonContent className="ion-padding"></IonContent>
    </IonPage>
  )
}

export default Component
