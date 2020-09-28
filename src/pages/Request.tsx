import React from 'react'
import Moment from 'moment'

import { CallNumber } from '@ionic-native/call-number'
import { platformIsMobile } from 'utils'

import { IonContent, IonPage, IonLabel, IonBadge, IonList, IonItem, IonText, IonButton } from '@ionic/react'
import { Header } from 'components'
import { MapContainer } from 'containers'

import { ItemRequest as ItemRequestInterface } from 'types'
import { userIsNotClientUser, userIsCourier } from 'utils/role'

type Props = {
  location: { state?: { request: ItemRequestInterface } }
}

const callCourierButtonStyle = {
  position: 'absolute',
  top: 0,
  left: 0
}

class Component extends React.Component<Props> {

  requestPresent = () => {
    const { location: { state } } = this.props
    return (
      state !== undefined &&
      state.request !== undefined
    )
  }

  callAction = () => {
    const { location: { state } } = this.props
    if (
      state === undefined ||
      state.request === undefined
    ) return null

    const { courier, user } = state.request

    return userIsCourier()
      ? `Call Client - ${user.name || user.phone}`
      : (
        courier ? `Call Courier - ${courier.name || courier.phones[0] || ''}` : ''
      )
  }

  onCall = () => {
    const { location: { state } } = this.props
    if (
      state === undefined ||
      state.request === undefined
    ) return null

    const { courier, user } = state.request

    const phone = userIsCourier() ? user.phone : (
      courier ? courier.phones[0] : ''
    )
    CallNumber.callNumber(`+${phone}`, true)
  }

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

    const userCanViewRequestClient = userIsNotClientUser()
    const userCanViewCallButton = platformIsMobile && requestState === 'in transit'

    return (
      <IonPage>
        <Header size="small" title={title} />
        <IonContent className="ion-no-padding">
          <IonList lines="full" className="fill-height ion-no-padding">
            <IonItem>
              <IonLabel>
                <p style={{
                  marginBottom: 'unset', lineHeight: 'unset'
                }}><IonBadge style={{
                  background: mapRequestStateToBadgeBackground(requestState)
                }}>{requestState}</IonBadge></p>
              </IonLabel>
              <IonLabel><p className="ion-text-end">Made {formatDate(createdAt)} ago</p></IonLabel>
            </IonItem>
            <IonItem lines="none">
              <IonLabel>
                <p>Delivery at <b>{`${lat}, ${lon}`}</b></p>
                {userCanViewRequestClient
                  ? <p>Client - {user.name || user.phone}</p>
                  : null}
              </IonLabel>
            </IonItem>
            <IonItem lines="none" className="fill-height ion-no-padding" style={{
              '--inner-padding-end': 0,
              position: 'relative'
            }}>
              <MapContainer mapCenter={{ lat, lon }} />
              {courier && userCanViewCallButton ? <IonButton onClick={this.onCall}
                style={callCourierButtonStyle}
                className="ion-margin"
              >
                {this.callAction()}
              </IonButton> : null}
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
