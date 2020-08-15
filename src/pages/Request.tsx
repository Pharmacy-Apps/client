import React from 'react'
import Moment from 'moment'

import { IonContent, IonPage, IonLabel, IonBadge, IonList, IonItem, IonText } from '@ionic/react'
import { Header } from 'components'
import { MapContainer } from 'containers'

import { ItemRequest as ItemRequestInterface } from 'types'

type Props = {
  location: { state?: { request: ItemRequestInterface } }
}

class Component extends React.Component<Props> {

  render() {
    const { location: { state } } = this.props
    if (
      state === undefined ||
      state.request === undefined
    ) return null

    const { pharmacyItems, state: requestState, createdAt, courier, lat, lon, user } = state.request

    const title = <p className="ion-text-wrap">{
      pharmacyItems.map((o, i) => (i > 0 ? ', ' : '') + (
        o.item['common-name'] || o.item['scientific-name']
      ))
    }</p>

    const userCanViewRequestClient = false

    return (
      <IonPage>
        <Header size="small" title={title} />
        <IonContent className="ion-no-padding">
          <IonList lines="full" className="fill-height ion-no-padding">
            <IonItem>
              <IonText>
                <IonLabel>
                  <p style={{
                    marginBottom: 'unset', lineHeight: 'unset'
                  }}><IonBadge style={{
                    background: mapRequestStateToBadgeBackground(requestState)
                  }}>{requestState}</IonBadge></p>
                </IonLabel>
              </IonText>
              <IonText slot="end">
                <IonLabel><p>Made {formatDate(createdAt)} ago</p></IonLabel>
              </IonText>
            </IonItem>
            <IonItem lines="none">
              <IonLabel>
                <p>Delivery to <b>{`${lat}, ${lon}`}</b></p>
                {userCanViewRequestClient
                  ? <p>Client - {user.name || user.phone}</p>
                  : null}
                {courier ? <p>Courier - {`${courier.name}`}</p> : null}
              </IonLabel>
            </IonItem>
            <IonItem lines="none" className="fill-height ion-no-padding" style={{ '--inner-padding-end': 0 }}>
              <MapContainer setLocation={() => { }} />
            </IonItem>
          </IonList>
        </IonContent>
      </IonPage>
    )
  }

}

function mapRequestStateToBadgeBackground(state: string) {
  switch (window.location.pathname) {
    // case '5': return 'var(--ion-color-primary)' // received
    // case '4': return 'var(--ion-color-primary)' // delivered
    case '3': return 'var(--ion-color-cancelled)' // cancelled
    case '2': return 'var(--ion-color-transit)' // in transit
    case '1': return 'var(--ion-color-out-of-stock)' // out of stock
    // case '0': return 'var(--ion-color-primary)' // awaiting transit
    default: return 'var(--ion-color-primary)'
  }
}

function formatDate(date: number) {
  return Moment(date).fromNow()
}

export default Component
