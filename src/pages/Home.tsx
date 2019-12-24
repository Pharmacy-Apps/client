import React from 'react'
import { IonContent, IonPage } from '@ionic/react'

import { Header } from 'components'

const Home: React.FC = () => {
  return (
    <IonPage>
      <Header omitsBack title="Requests" />
      <IonContent className="ion-padding">
        Oyster
      </IonContent>
    </IonPage>
  )
}

export default Home
