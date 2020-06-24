import React from 'react'
import { IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol } from '@ionic/react'

import { squareOutline as numb, checkbox as active } from 'ionicons/icons'

import { MedSearchResult } from 'types'

export type Props = {
  selected: boolean,
  onSelect: Function,
  lines: boolean,
  result: MedSearchResult
}

const Component: React.FC<Props> = ({
  result,
  lines,
  selected,
  onSelect
}) => {
  const { med, price, distance } = result
  return (
    <IonItem
      button
      lines={lines ? 'inset' : 'none'}
      onClick={() => onSelect(result)}
      className="search-result"
    >
      <IonIcon
        color="primary"
        icon={selected ? active : numb}
        slot="start"
      />
      <IonGrid>
        <IonRow>
          <IonCol className="ion-no-padding">
            <IonLabel>{med.name}</IonLabel>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol className="ion-no-padding">
            <IonLabel><p>{`${price} credits`}</p></IonLabel>
          </IonCol>
          <IonCol className="ion-no-padding">
            <IonLabel className="ion-text-right"><p>{distance}</p></IonLabel>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonItem>
  )
}

export default Component