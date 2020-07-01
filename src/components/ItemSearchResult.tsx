import React from 'react'
import { IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol } from '@ionic/react'

import { squareOutline as numb, checkbox as active } from 'ionicons/icons'

import { ItemSearchResult } from 'types'

export type Props = {
  selected: boolean,
  onSelect: Function,
  lines: boolean,
  result: ItemSearchResult
}

const checkBoxStyle = { margin: 0, padding: '16px' }

const Component: React.FC<Props> = ({
  result,
  lines,
  selected,
  onSelect
}) => {
  const { item, price, distance } = result
  return (
    <IonItem
      button
      lines={lines ? 'inset' : 'none'}
      onClick={() => onSelect(result)}
      className="search-result ion-no-padding"
    >
      <IonIcon
        color="primary"
        icon={selected ? active : numb}
        slot="start"
        style={checkBoxStyle}
      />
      <IonGrid>
        <IonRow>
          <IonCol className="ion-no-padding">
            <IonLabel><h2>{item.name}</h2></IonLabel>
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
        {selected ? <>
          <IonRow>
            <IonCol className="ion-no-padding">
              <IonLabel><p>{
                result.item.description.map((text, i, a) =>
                  `${text}${a.length - 1 === i ? '' : ', '}`)
              }</p></IonLabel>
            </IonCol>
          </IonRow>
        </> : null}
      </IonGrid>
    </IonItem>
  )
}

export default Component