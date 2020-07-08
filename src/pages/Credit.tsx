import React from 'react'
import Routes from 'routes'
import { History } from 'history'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as constants from 'reducers/constants'

import { IonContent, IonPage, IonList, IonItem, IonLabel, IonIcon, IonItemDivider, IonAlert, IonButton } from '@ionic/react'
import { starOutline as numb, star as active } from 'ionicons/icons'

import { Header } from 'components'
import { MSISDNModify as MSISDNModifyPopover } from 'containers'

import Requests, { endPoints } from 'requests'

import decrypt from 'libs/jwt'
import { formatUGMSISDN } from 'libs/msisdn'
import { getSessionToken, setSessionToken, getSessionPhone } from 'session'

type Props = {
  history: History,
  showLoading: () => {},
  hideLoading: () => {},
  showToast: (e: string) => {},
}

type State = {
  offers: Array<Offer>,
  selectedOffer: string | null,
  alert: {
    shown: boolean,
    header: string,
    message: string,
    buttonText: string,
    confirmsPayment: boolean
  },
  msisdnPopoverShown: boolean
}

const message = {
  default: 'Lorem ipsum payment lorem ipsum payment lorem ipsum payment lorem ipsum payment lorem ipsum payment lorem ipsum payment lorem ipsum payment lorem ipsum',
  fromOrder: 'Lorem order ipsum payment lorem ipsum payment lorem ipsum payment lorem ipsum payment lorem ipsum payment lorem ipsum payment lorem ipsum payment lorem ipsum'
}

class Component extends React.Component<Props> {

  state: State = {
    offers: [],
    selectedOffer: null,
    alert: {
      shown: false, header: '', message: '', buttonText: '', confirmsPayment: false
    },
    msisdnPopoverShown: false
  }

  componentDidMount() {
    const { showLoading, hideLoading, showToast } = this.props
    showLoading()
    Requests.get(endPoints['credit-offers']).then((response: any) => {
      this.setState({ offers: response, selectedOffer: response[0]._id })
    }).catch(err => {
      console.error(err)
      showToast(err.error || err.toString())
    }).finally(hideLoading)
  }

  onPaymentChannelSelect = ({ _id: id }: Channel) => {
    const { header, message } = AlertText[id]()
    switch (id) {
      case 'airtel': {
        this.showAlert({ header, message, confirmsPayment: true })
        break
      }
      default: {
        this.showAlert({ header, message, confirmsPayment: true })
        break
      }
    }
  }

  onConfirmPaymentChannel = () => {
    const { selectedOffer: offer, offers } = this.state
    const { showLoading, hideLoading, showToast } = this.props
    showLoading()
    Requests.post(endPoints['credits'], { offer }).then((response: any) => {
      const errored = false // Payment succeeded
      if (errored) {
        this.showAlert(AlertText['payment-errored']())
      } else {
        this.showAlert(AlertText['payment-succeded']((
          offers.find(({ _id }) => _id === offer) || {}
        ).value))
        if (this.redirectedFromOrder()) {
          // Redirect back
        }
      }
    }).catch(err => {
      console.error(err)
      showToast(err.error || err.toString())
    }).finally(hideLoading)
  }

  onOfferSelect = ({ _id }: Offer) => {
    this.setState({ selectedOffer: _id })
  }

  showMSISDNPopover = () => {
    this.setState({ msisdnPopoverShown: true })
  }

  hideMSISDNPopover = () => {
    this.setState({ msisdnPopoverShown: false })
  }

  showAlert = (alert: AlertState) => {
    this.setState({ alert: { ...alert, shown: true } })
  }

  hideAlert = () => {
    this.setState({ alert: { ...this.state.alert, shown: false } })
  }

  onAlertConfirm = () => {
    const { alert } = this.state
    if (alert.confirmsPayment)
      this.onConfirmPaymentChannel()
  }

  onSubmitChangeNumber = (msisdn: string) => {
    this.hideMSISDNPopover()
    const { showLoading, hideLoading, showToast } = this.props
    showLoading()
    Requests.post(
      endPoints['mtn-msisdn'], { msisdn }
    ).then((response: any) => {
      setSessionToken(response)
    }).catch(err => {
      console.error(err)
      showToast(err.error || err.toString())
    }).finally(hideLoading)
  }

  onAlertDismiss = () => {
    this.hideAlert()
    const { alert } = this.state
    if (alert.confirmsPayment) return
    if (this.redirectedFromOrder()) {
      const { history: { location: { state } } } = this.props
      this.props.history.replace(Routes.order.path, state)
    }
  }

  redirectedFromOrder = () => {
    const { history: { location: { state } } } = this.props
    return state && state.selectedItems
  }

  getChannels = () => {
    const mtnMSISDNKey = 'mtn-msisdn'
    const {
      [mtnMSISDNKey]: msisdn
    } = decrypt(getSessionToken())
    return [{
      _id: 'mtn',
      name: 'MTN Mobile Money',
      description: formatUGMSISDN(msisdn || getSessionPhone()),
      requiresNumber: true
    }] as Array<Channel>
  }

  render() {
    const { offers, alert, selectedOffer, msisdnPopoverShown } = this.state
    return offers.length ? (
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
                lines={i === a.length - 1 ? 'none' : undefined}
              >
                <IonIcon color="primary" icon={
                  offer._id === selectedOffer ? active : numb
                } slot="start" />
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
            this.getChannels().map((channel, i, a) => (
              <IonItem
                key={channel._id}
                onClick={() => this.onPaymentChannelSelect(channel)}
                button
                lines={i === a.length - 1 ? 'none' : undefined}
              >
                {/* <IonIcon icon={rocket} slot="start" /> */}
                <IonLabel>
                  <h3>{channel.name}</h3>
                  <p>{channel.description}</p>
                </IonLabel>
                {channel.requiresNumber ? <IonButton onClick={e => {
                  e.stopPropagation()
                  this.showMSISDNPopover()
                }} fill="clear">Change Number</IonButton> : null}
              </IonItem>
            ))
          }</IonList>
          <Alert
            open={alert.shown}
            header={alert.header}
            message={alert.message}
            onConfirm={this.onAlertConfirm}
            onDismiss={this.onAlertDismiss}
          />
          <MSISDNModifyPopover
            open={msisdnPopoverShown}
            onDismiss={this.hideMSISDNPopover}
            onSubmit={this.onSubmitChangeNumber}
          />
        </IonContent>
      </IonPage>
    ) : null
  }

}

type Offer = {
  _id: string,
  value: number,
  price: number,
  starred?: boolean
}

type Channel = {
  _id: string,
  name: string,
  description: string,
  requiresNumber?: boolean
}

type AlertState = {
  shown?: boolean,
  header: string,
  message: string,
  buttonText?: string,
  confirmsPayment?: boolean
}

type AlertProps = {
  open: boolean,
  header: string,
  message: string,
  buttonText?: string,
  onConfirm: () => void
  onDismiss: () => void
}

const AlertText: ({
  [key: string]: ((e?: any) => ({
    header: string,
    message: string
  }))
}) = {
  'payment-succeded': (credits: number) => ({
    header: 'Lorem ipsum',
    message: `Lorem ipsum ${credits} payment lorem ipsum payment`
  }),
  'payment-errored': () => ({
    header: 'Lorem ipsum error',
    message: 'Lorem ipsum payment lorem ipsum payment error'
  }),
  'mtn': () => ({
    header: 'Lorem ipsum MTN',
    message: `
      <p>Lorem ipsum payment lorem ipsum payment</p>
      <p>Lorem ipsum payment</p>
    `
  }),
  'airtel': () => ({
    header: 'Lorem ipsum Airtel',
    message: 'Lorem ipsum payment lorem ipsum payment error'
  })
}

const Alert: React.FC<AlertProps> = ({
  open,
  header,
  message,
  buttonText,
  onConfirm,
  onDismiss
}) => (
    <IonAlert
      isOpen={open}
      onWillDismiss={onDismiss}
      header={header || ''}
      message={message || ''}
      buttons={[
        {
          text: buttonText || 'Okay',
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
  showToast: (payload: string) => ({
    type: constants.SHOW_TOAST,
    payload
  }),
}, dispatch)

export default connect(null, mapDispatchToProps)(Component)
