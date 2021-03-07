import React from 'react'

import { IonItem, IonLabel, IonGrid, IonRow, IonCol, IonIcon } from '@ionic/react'

import { LazyLoad } from 'components'

import { ItemSearchResult } from 'types'
import { imageServerUrl, itemState } from 'utils'
import { formatMoney } from 'utils/currency'

import { wrapperWidthSpan as imageWrapperWidthSpan } from 'components/LazyLoad'

export type Props = {
  selected: boolean,
  onSelect: (a1: any) => void,
  onImageClick: () => void,
  onMore: (a1: any) => void,
  lines: boolean,
  result: ItemSearchResult
}

const Component: React.FC<Props> = ({
  result,
  lines,
  selected,
  onSelect,
  onImageClick,
  onMore
}) => {
  const { item, price } = result

  const onClick = (e: any, action: string) => {
    if (action === 'primary') {
      onSelect(result)
      return
    }
    e.stopPropagation()
    onMore(result)
  }

  return (
    <IonItem
      button
      lines={lines ? 'full' : 'none'}
      onClick={e => onClick(e, 'primary')}
      className="search-result ion-no-padding"
    >
      <LazyLoad onClick={onImageClick} item={item.name} src={`${imageServerUrl}${item['icon-urls'][0]}`} />
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
        {result.available ? null : <IonRow>
          <IonCol className="ion-no-padding">
            <IonLabel className="ion-label-secondary"><h4>{itemState(false)}</h4></IonLabel>
          </IonCol>
        </IonRow>}
        <IonRow>
          <IonCol className="ion-no-padding ion-padding-top">
            <IonLabel onClick={e => onClick(e, 'more')} className="ion-label-primary"><h4><b>More</b></h4></IonLabel>
          </IonCol>
        </IonRow>
      </IonGrid>
      <IonIcon className="ion-icon-primary" icon={
        selected ? '/assets/icons/checked.svg' : 'no-icon'
      } />
    </IonItem >
  )
}

export default Component