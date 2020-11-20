import React from 'react'

import { ItemSearchResult } from 'types'
import { IonList, IonItem } from '@ionic/react'

import { imageServerUrl } from 'utils'

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

  const { item: { 'icon-url': url, name } } = result

  return (
    <IonList lines="full" className="ion-no-padding">
      <IonItem>{name}</IonItem>
      <IonItem style={wrapperStyle} lines="none">
        <img src={imageServerUrl + url} alt="" />
      </IonItem>
    </IonList>
  )

}

export default Component