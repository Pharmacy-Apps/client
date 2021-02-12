import React from 'react'
import Moment from 'moment'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as constants from 'reducers/constants'

import { CallNumber } from '@ionic-native/call-number'

import { IonContent, IonPage, IonLabel, IonBadge, IonList, IonItem, IonButton, IonIcon, IonText } from '@ionic/react'
import { close } from 'ionicons/icons';

import { Header, Divider } from 'components'
import { MapContainer } from 'containers'

import { ItemRequest as ItemRequestInterface } from 'types'
import { platformIsMobile, requestStatesMappedToBadgeBackground } from 'utils'
import { userIsNotClientUser, userIsCourier } from 'utils/role'
import { deliveryCost, computeOrderCostAndDistance } from 'utils/charges'
import { formatMoney } from 'utils/currency'

import Requests, { endPoints } from 'requests'

import { computeDistance } from 'location'

type Props = {
  location: { state?: { request: ItemRequestInterface } },
  setItemRequest: (a: ItemRequestInterface) => {},
}

const callCourierButtonStyle = {
  position: 'absolute',
  top: 0,
  left: 0
}

class Component extends React.Component<Props> {

  state = (
    this.props.location.state !== undefined &&
    this.props.location.state.request !== undefined
  ) ? {
      distance: this.props.location.state.request.aDistance,
      address: this.props.location.state.request.address
    } : {
      distance: null, address: null
    }

  saveComputedDistance(distance: number) {
    const { location: { state }, setItemRequest } = this.props
    if (
      state === undefined ||
      state.request === undefined
    ) return null

    this.setState(
      { distance },
      () => setItemRequest({ ...state.request, aDistance: distance })
    )

    Requests.put(endPoints['item-requests'], {
      'item-requests': [state.request._id],
      update: { aDistance: distance }
    }).catch(console.error)

  }

  onMapApiLoaded = async (map: google.maps.Map) => {

    const { distance = null } = this.state

    if (distance === null) { // else Directions Service already computed distance
      const distanceInMetres: number | null = await computeDistance(map)
      distanceInMetres && this.saveComputedDistance(distanceInMetres)
    }

  }

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

  requestCost = this.props.location.state && this.props.location.state.request
    ? computeOrderCostAndDistance(
      this.props.location.state.request.pharmacyItems
    ).cost
    : 0

  render() {
    const { location: { state } } = this.props
    if (
      state === undefined ||
      state.request === undefined
    ) return null

    const {
      pharmacyItems, state: requestState, createdAt, courier, lat, lon, address, user
    } = state.request
    const { distance = null } = this.state

    const title = <p className="ion-text-wrap">{
      pharmacyItems.map((o, i) => <span key={i} className="flex-inline ion-align-items-center">
        {i > 0 ? <span>,&nbsp;&nbsp;</span> : null}
        {o.item['common-name'] || o.item['scientific-name']}
        {false ? <>
          <span>&nbsp;</span>
          <IonIcon icon={close} />
          <span>&nbsp;</span>
          {o.quantity}
        </> : null}
      </span>)
    }</p>

    const userCanViewRequestClient = userIsNotClientUser()
    const userCanViewCallButton = platformIsMobile && requestState === 'in transit'

    return (
      <IonPage className="request-detail">
        <Header size="small" title={title} />
        <IonContent className="ion-no-padding">
          <IonLabel>
            <IonList lines="full" className="ion-no-padding">
              <IonItem>
                <IonLabel>
                  <p style={{
                    marginBottom: 'unset', lineHeight: 'unset'
                  }}><IonBadge style={{
                    background: requestStatesMappedToBadgeBackground[requestState]
                  }}>{requestState}</IonBadge></p>
                </IonLabel>
                <IonLabel><p className="ion-text-end">Made {formatDate(createdAt)} ago</p></IonLabel>
              </IonItem>
            </IonList>
            <IonList lines="none" className="ion-padding">{
              pharmacyItems.map(({ item, price, quantity }, i) => (
                <IonItem
                  key={i}
                  lines="none"
                  className="ion-no-padding mini-list-item"
                >
                  <h4>{item['common-name'] || item['scientific-name']}</h4>
                  <h4 slot="end">
                    {quantity}&nbsp;
                    <IonIcon style={{ fontSize: 12 }} icon={close} />&nbsp;
                    {formatMoney(price)}
                  </h4>
                </IonItem>))
            }
              <IonItem
                lines="none"
                className="ion-no-padding mini-list-item"
              >
                <h4 className="ion-text-uppercase ion-label-primary">Total</h4>
                <h4 slot="end" className="flex ion-align-items-center ion-label-primary">
                  <b>{formatMoney(this.requestCost)}</b>
                </h4>
              </IonItem>
              <IonItem
                lines="none"
                className="ion-no-padding mini-list-item"
              >
                <IonText><IonLabel><p>Delivery fee</p></IonLabel></IonText>
                <h4 slot="end" className="flex ion-align-items-center">{formatMoney(deliveryCost)}</h4>
              </IonItem>
            </IonList>
          </IonLabel>
          <Divider />
          <IonList lines="none" className="fill-height ion-no-padding">
            <IonItem>
              <IonLabel>
                <p className="ion-label-primary">Delivery at <b>{address}</b></p>
                {distance !== null
                  ? <p className="ion-label-primary">~ <b>{distance}m</b></p>
                  : null
                }
                {userCanViewRequestClient
                  ? <p>Client - {user.name || user.phone}</p>
                  : null}
              </IonLabel>
            </IonItem>
            <IonItem className="fill-height ion-no-padding" style={{
              position: 'relative',
              '--inner-padding-end': 0
            }}>
              <MapContainer mapCenter={{ lat, lon }} onMapApiLoaded={this.onMapApiLoaded} />
              {courier && userCanViewCallButton ? <IonButton onClick={this.onCall}
                style={callCourierButtonStyle}
                className="ion-margin"
              >
                {this.callAction()}
              </IonButton> : null}
            </IonItem>
          </IonList>
        </IonContent>
      </IonPage >
    )
  }

}

function formatDate(date: number) {
  return Moment(date).fromNow()
}

// const mapStateToProps = (state: ReducerState) => ({
//   requests: state.App.requests || undefined
// })

const mapDispatchToProps = (dispatch: any) => bindActionCreators({
  setItemRequest: payload => ({
    type: constants.SET_ITEM_REQUEST,
    payload
  })
}, dispatch)

export default connect(null, mapDispatchToProps)(Component)
