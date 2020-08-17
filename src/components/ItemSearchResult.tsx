import React from 'react'
import { IonItem, IonLabel, IonGrid, IonRow, IonCol } from '@ionic/react'

import { LazyLoad } from 'components'

import { ItemSearchResult } from 'types'
import { imageServerUrl } from 'utils'

export type Props = {
  selected: boolean,
  onSelect: Function,
  lines: boolean,
  result: ItemSearchResult
}

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
      lines={lines ? 'full' : 'none'}
      onClick={() => onSelect(result)}
      className="search-result ion-no-padding"
    >
      <LazyLoad item={item.name} selected={selected} src={`${imageServerUrl}${item['icon-url']}`} />
      <IonGrid>
        <IonRow>
          <IonCol className="ion-no-padding">
            <IonLabel><h2>{item.name}</h2></IonLabel>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol className="ion-no-padding">
            <IonLabel><p>{
              result.item.description.map((text, i, a) =>
                `${text}${a.length - 1 === i ? '' : ', '}`)
            }</p></IonLabel>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol className="ion-no-padding">
            <IonLabel><p>{`UGX ${price}`}</p></IonLabel>
          </IonCol>
          <IonCol className="ion-no-padding">
            <IonLabel className="ion-text-right"><p>{distance}</p></IonLabel>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonItem >
  )
}

export default Component