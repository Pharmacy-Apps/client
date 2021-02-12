import React from 'react'

import { IonItem, IonLabel, IonGrid, IonRow, IonCol, IonIcon } from '@ionic/react'

import { LazyLoad } from 'components'

import { ItemSearchResult } from 'types'
import { imageServerUrl } from 'utils'
import { formatMoney } from 'utils/currency'

import { wrapperWidthSpan as imageWrapperWidthSpan } from 'components/LazyLoad'

export type Props = {
  selected: boolean,
  onSelect: (a1: any) => void,
  onImageClick: () => void,
  lines: boolean,
  result: ItemSearchResult
}

const Component: React.FC<Props> = ({
  result,
  lines,
  selected,
  onSelect,
  onImageClick
}) => {
  const { item, price } = result
  return (
    <IonItem
      button
      lines={lines ? 'full' : 'none'}
      onClick={() => onSelect(result)}
      className="search-result ion-no-padding"
    >
      <LazyLoad onClick={onImageClick} item={item.name} src={`${imageServerUrl}${item['icon-url']}`} />
      <IonGrid style={{
        width: `calc(100% - ${imageWrapperWidthSpan}px)` // Compute what's left after image fills space
      }}>
        <IonRow>
          <IonCol className="ion-no-padding">
            <IonLabel><h2 className="ion-label-primary">{item.name}</h2></IonLabel>
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
            <IonLabel><h4>{formatMoney(price)}</h4></IonLabel>
          </IonCol>
          {/* <IonCol className="ion-no-padding">
            <IonLabel className="ion-text-right"><p>{distance}</p></IonLabel>
          </IonCol> */}
        </IonRow>
      </IonGrid>
      <IonIcon className="ion-icon-primary" icon={
        selected ? '/assets/icons/checked.svg' : 'no-icon'
      } />
    </IonItem >
  )
}

export default Component