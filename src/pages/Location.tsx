import React, { useState, Dispatch, SetStateAction } from 'react'
import { History } from 'history'

import { IonContent, IonPage, IonButton } from '@ionic/react'

import { Header } from 'components'
import { MapContainer } from 'containers'

import { setDeliveryLocation } from 'session'

import { Location as LocationInterface } from 'types'

const title = 'Destination'
const primaryAction = 'Select this location'

const actionButtonStyle = {
  position: 'absolute',
  bottom: 0
}

const Component: React.FC<{
  history: History
}> = ({ history }) => {
  type i = [LocationInterface | null, Dispatch<SetStateAction<any>>]
  const [location, setLocation]: i = useState(null)

  const onPrimaryAction = () => {
    if (location) setDeliveryLocation(location)
    history.goBack()
  }
  return (
    <IonPage>
      <Header title={title} />
      <IonContent>
        <MapContainer setLocation={setLocation} />
        <IonButton onClick={onPrimaryAction} style={actionButtonStyle} className="ion-margin">{primaryAction}</IonButton>
      </IonContent>
    </IonPage>
  )
}

export default Component
