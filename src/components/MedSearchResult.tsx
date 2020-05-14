import React from 'react'
import { IonItem, IonLabel, IonText, IonIcon } from '@ionic/react'

import { checkmark, checkmarkCircleOutline } from 'ionicons/icons'

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
  const { med, pharmacy, price } = result
  return (
    <IonItem
      button
      lines={lines ? 'inset' : 'none'}
      onClick={() => onSelect(result)}
    >
      <IonIcon
        color={selected ? 'primary' : undefined}
        icon={selected ? checkmarkCircleOutline : checkmark}
        slot="start"
      />
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