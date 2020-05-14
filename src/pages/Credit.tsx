import React from 'react'
import Routes from 'routes'
import { History } from 'history'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as constants from 'reducers/constants'

import { IonContent, IonPage, IonList, IonItem, IonLabel, IonIcon, IonItemDivider, IonAlert } from '@ionic/react'
import { star, rocket } from 'ionicons/icons';

import { Header } from 'components'

export type Props = {
  history: History,
  showLoading: Function,
  hideLoading: Function,
}

const message = {
  default: 'Lorem ipsum payment lorem ipsum payment lorem ipsum payment lorem ipsum payment lorem ipsum payment lorem ipsum payment lorem ipsum payment lorem ipsum',
  fromOrder: 'Lorem order ipsum payment lorem ipsum payment lorem ipsum payment lorem ipsum payment lorem ipsum payment lorem ipsum payment lorem ipsum payment lorem ipsum'
}

class Component extends React.Component<Props> {

  state = {
    selectedOffer: offers[0]._id,
    alert: { shown: false, errored: 0 }
  }

  onPaymentChannelSelect = (channel: Channel) => {
    console.info(channel)
    this.fakeRequest((hideLoading: Function) => {
      hideLoading()
      const errored = false

      if (errored) {
        this.showAlert({ errored: 1 })
      } else if (this.redirectedFromOrder()) {
        this.showAlert({ errored: 0 })
      } else {
        this.showAlert({ errored: 0 })
      }
    })
  }

  fakeRequest(cb: Function) {
    const { showLoading, hideLoading } = this.props
    showLoading()
    setTimeout(() => cb(hideLoading), 1500)
  }
  
  onOfferSelect = ({ _id }: Offer) => {
    this.setState({ selectedOffer: _id })
  }

  showAlert = (alert: AlertState) => {
    this.setState({ alert: { ...alert, shown: true } })
  }

  hideAlert = () => {
    this.setState({ alert: { ...this.state.alert, shown: false } })
  }

  onAlertDismiss = () => {
    this.hideAlert()
    if (this.redirectedFromOrder()) {
      const { history: { location: { state } } } = this.props
      console.info('state.selectedMeds', state)
      this.props.history.replace(Routes.order.path, state)
    }
  }

  redirectedFromOrder = () => {
    const { history: { location: { state } } } = this.props
    return state && state.selectedMeds
  }

  render() {
    const { alert, selectedOffer } = this.state
    return (
      <IonPage>
        <Header title="Purchase credits" />
        <IonContent className="ion-padding">
          <IonLabel>
            <p>{this.redirectedFromOrder() ? message.fromOrder : message.default}</p>
          </IonLabel>
          <IonLabel>
            <p>Lorem ipsum payment lorem ipsum payment</p>
          </IonLabel>
          <IonList lines="full" className="ion-margin-top ion-no-padding">{
            offers.map((offer, i, a) => (
              <IonItem
                key={offer._id}
                onClick={() => this.onOfferSelect(offer)}
                button
                lines={i === a.length-1 ? 'none' : undefined}
              >
                <IonIcon color={offer._id === selectedOffer ? 'primary' : undefined} icon={star} slot="start" />
                <IonLabel>
                  <h3>{`${offer.value} credits`}</h3>
                  <p>{`USD ${offer.price}`}</p>
                </IonLabel>
              </IonItem>
            ))
          }</IonList>
          <IonItemDivider className="ion-margin-top">
            <IonLabel>
              Select payment channel
            </IonLabel>
          </IonItemDivider>
          <IonList lines="full" className="ion-no-padding">{
            channels.map((channel, i, a) => (
              <IonItem
                key={channel._id}
                onClick={() => this.onPaymentChannelSelect(channel)}
                button
                lines={i === a.length-1 ? 'none' : undefined}
              >
                <IonIcon icon={rocket} slot="start" />
                <IonLabel>
                  <h3>{channel.name}</h3>
                  <p>{channel.description}</p>
                </IonLabel>
              </IonItem>
            ))
          }</IonList>
          <Alert
            open={alert.shown}
            errored={alert.errored}
            onConfirm={() => {}}
            afterDismiss={this.onAlertDismiss}
          />
        </IonContent>
      </IonPage>
    )
  }

}

type Offer = {
  _id: string,
  value: number,
  price: number,
  starred?: boolean
}
const offers: Array<Offer> = [{
  _id: '1',
  value: 500,
  price: 2,
  starred: true
}, {
  _id: '2',
  value: 5000,
  price: 15
}, {
  _id: '3',
  value: 20000,
  price: 40
}]

type Channel = {
  _id: string,
  name: string,
  description: string,
}
const channels: Array<Channel> = [{
  _id: '1', name: 'MTN Mobile Money', description: '+256 783 324449'
}, {
  _id: '2', name: 'Airtel Money', description: ''
}]

const AlertText = [
  { header: 'Lorem ipsum', message: 'Lorem ipsum payment lorem ipsum payment' },
  { header: 'Lorem ipsum error', message: 'Lorem ipsum payment lorem ipsum payment error' }
]

type AlertState = { errored: number, shown?: boolean }
type AlertProps = {
  open: boolean,
  errored: number,
  onConfirm: () => void
  afterDismiss: () => void
}
const Alert: React.FC<AlertProps> = ({
  open,
  errored: textIndex,
  onConfirm,
  afterDismiss
}) => (
  <IonAlert
    isOpen={open}
    onDidDismiss={afterDismiss}
    header={AlertText[textIndex].header}
    message={AlertText[textIndex].message}
    buttons={[
      {
        text: 'Okay',
        handler: onConfirm
      }
    ]}
  />
)

const mapDispatchToProps = (dispatch: any) => bindActionCreators({
  showLoading: () => ({
    type: constants.SHOW_LOADING
  }),
  hideLoading: () => ({
    type: constants.HIDE_LOADING
  }),
}, dispatch)

export default connect(null, mapDispatchToProps)(Component)
