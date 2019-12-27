import React from 'react'
import { History } from 'history'
import { IonContent, IonPage, IonList, IonItem, IonLabel, IonButton, IonText } from '@ionic/react'

import { Header } from 'components'

export type Props = {
  history: History,
}

const items = [{
  name: 'Credits',
  value: '100',
  action: 'Purchase Credits',
  handler: () => {},
  starred: true
}, {
  name: 'Last delivery location',
  value: 'Location Address',
  action: 'Change',
  handler: () => {}
}, {
  name: 'Phone',
  value: '783828111',
  skipsAction: true
}]

const Component: React.FC<Props> = () => {
  return (
    <IonPage>
      <Header title="Account" />
      <IonContent className="ion-padding">
        <IonList lines="full" className="ion-no-margin ion-no-padding">{
          items.map((item, i, a) => {
            return <IonItem { ...i + 1 === a.length ?  { lines: "none" } : {} }>
            <IonLabel>
              <p>{item.name}</p>
              <IonText { ...item.starred ?  { color: "primary" } : {} }>
                <h2>{item.value}</h2>
              </IonText>
            </IonLabel>
            {item.skipsAction ? null : <IonButton type="button" { ...item.starred ?  {} : { fill: "clear" } } className="ion-no-margin" slot="end" onClick={item.handler}>{
              item.action
            }</IonButton>}
          </IonItem>
        })}</IonList>
      </IonContent>
    </IonPage>
  )
}

export default Component
