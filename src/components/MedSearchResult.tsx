import React from 'react'
import { IonItem, IonLabel, IonText } from '@ionic/react'

import { MedSearchResult } from 'types'

export type Props = {
  lines: boolean,
  result: MedSearchResult
}

const Component: React.FC<Props> = ({ result: { med, pharmacy, price }, lines }) => {
  return (
    <IonItem button lines={lines ? 'full' : 'none'}>
      <IonLabel>
        <h2>{med.name} at {pharmacy.name}</h2>
        <p>{pharmacy.distance}</p>
      </IonLabel>
      <IonText slot="end">
        <IonLabel><p>{`${price} credits`}</p></IonLabel>
      </IonText>
    </IonItem>
  )
}

export default Component