import React from 'react'

import { IonList, IonItem } from '@ionic/react'
import { ImageSlider } from 'components'

import { ItemSearchResult } from 'types'

type Props = {
  result: ItemSearchResult | null
}

const wrapperStyle = {
  '--padding-start': 0,
  '--padding-end': 0,
  '--inner-padding-start': 0,
  '--inner-padding-end': 0
}

const Component: React.FC<Props> = ({ result }) => {

  if (result === null) return null

  const { item: { 'icon-urls': urls, name } } = result

  return (
    <IonList lines="full" className="ion-no-padding">
      <IonItem>{name}</IonItem>
      <IonItem style={wrapperStyle} lines="none">
        <ImageSlider urls={urls} imageStyle={{ height: '100%' }} />
      </IonItem>
    </IonList>
  )

}

export default Component