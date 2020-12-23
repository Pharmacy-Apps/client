import React from 'react'
import Routes from 'routes'
import { History } from 'history'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as constants from 'reducers/constants'

import { IonContent, IonPage, IonList, IonItem, IonLabel, IonButton, IonIcon } from '@ionic/react'

import { Header, Alert } from 'components'
import { MSISDNModify as MSISDNModifyPopover } from 'containers'

import Requests, { endPoints } from 'requests'

// import decrypt from 'utils/jwt'

// import { formatUGMSISDN } from 'utils/msisdn'
import { setSessionToken, setActiveRequestsPresence } from 'session'
import { getDeliveryLocationForNextOrder as getDeliveryLocationForOrder } from 'location'

import { ItemSearchResult as ItemSearchResultInterface, PaymentChannel as Channel } from 'types'
import { formatMoney } from 'utils/currency'

type Props = {
  history: History | any,
  location: { state?: { selectedItems: Array<ItemSearchResultInterface> } },
  showLoading: () => {},
  hideLoading: () => {},
  showToast: (e: string) => {},
}

type State = {
  alert: {
    shown: boolean,
    header: string,
    message: string,
    buttonText: string,
    confirmsPayment: boolean
  },
  msisdnPopoverShown: boolean
}

// const message = null

class Component extends React.Component<Props> {

  state: State = {
    alert: {
      shown: false, header: '', message: '', buttonText: '', confirmsPayment: false
    },
    msisdnPopoverShown: false
  }

  componentDidMount() {
    const { location } = this.props
    if (location.state && location.state.selectedItems) return
    window.location.replace(Routes.home.path)
  }

  onPaymentChannelSelect = () => {
    const { location } = this.props
    const { header, message, buttonText } = AlertText['confirmation'](
      location.state && location.state.selectedItems.length === 1
    )
    this.showAlert({ header, message, buttonText, confirmsPayment: true })
  }

  onConfirmPaymentChannel = () => {
    const { showLoading, hideLoading, showToast, location } = this.props
    const { lat, lon } = getDeliveryLocationForOrder()
    if (location.state && location.state.selectedItems) {
      const payload = {
        'pharmacy-items': location.state.selectedItems.map(o => ({
          item: o._id, quantity: o.quantity
        })),
        'notes': '',
        lat,
        lon
      }
      showLoading()
      Requests.post(endPoints['item-requests'], payload).then((response: any) => {
        if (response.error) {
          console.error('Payment errored', response.error) // Show alert
          this.showAlert(AlertText['payment-errored']())
        } else {
          setActiveRequestsPresence(true)
          window.location.replace(Routes.home.path)
        }
      }).catch(err => {
        console.error(err)
        showToast(err.error || err.toString())
      }).finally(hideLoading)
    }
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

  getChannels = () => {
    // const mtnMSISDNKey = 'mtn-msisdn'
    // const {
    //   [mtnMSISDNKey]: msisdn
    // } = decrypt(getSessionToken())
    return [{
      _id: 'cash',
      name: 'Pay Cash on delivery',
      description: '',
      icon: '/assets/icons/wallet.svg',
    }, {
      _id: 'mtn',
      name: 'MTN Mobile Money',
      // description: <span className="ion-label-primary">{
      //   formatUGMSISDN(msisdn || getSessionPhone())
      // }</span>,
      // requiresNumber: true,
      icon: '/assets/icons/mobile-pay.svg',
      unavailable: true
    }] as Array<Channel>
  }

  render() {
    const { alert, msisdnPopoverShown } = this.state
    return (
      <IonPage>
        <Header title="Select payment channel" />
        <IonContent>
          <IonList lines="full" className="ion-no-padding">
            {/* <IonItem lines="none">
              <IonLabel style={{ whiteSpace: 'inherit' }}>
                <p>{message}</p>
              </IonLabel>
            </IonItem> */}
            {this.getChannels().map((channel, i, a) => (
              <IonItem
                key={channel._id}
                onClick={
                  channel.unavailable ? undefined : this.onPaymentChannelSelect
                }
                button
                lines={i === a.length - 1 ? 'none' : undefined}
              >
                <IonIcon className="ion-icon-primary" icon={channel.icon} slot="start" />
                <IonLabel>
                  <h3>{channel.name}</h3>
                  <p>{
                    channel.description || (
                      channel.unavailable ? 'Coming soon' : null
                    )
                  }</p>
                </IonLabel>
                {channel.requiresNumber ? <IonButton fill="clear" onClick={e => {
                  e.stopPropagation()
                  this.showMSISDNPopover()
                }}>
                  <IonIcon className="ion-icon-secondary" icon="/assets/icons/edit-secondary.svg" />
                </IonButton> : null}
              </IonItem>
            ))
            }</IonList>
          <Alert
            open={alert.shown}
            header={alert.header}
            message={alert.message}
            buttonText={alert.buttonText}
            onConfirm={this.onAlertConfirm}
            onDismiss={this.hideAlert}
          />
          <MSISDNModifyPopover
            open={msisdnPopoverShown}
            onDismiss={this.hideMSISDNPopover}
            onSubmit={this.onSubmitChangeNumber}
          />
        </IonContent>
      </IonPage>
    )
  }

}

type AlertState = {
  shown?: boolean,
  header: string,
  message: string,
  buttonText?: string,
  confirmsPayment?: boolean
}

const AlertText: ({
  [key: string]: ((e?: any) => ({
    header: string,
    message: string,
    buttonText?: string
  }))
}) = {
  'payment-succeeded': (credits: number) => ({
    header: 'Payment succeeded',
    message: `<ion-label>
      <p>${formatMoney(credits)} has been added to your wallet</p>
    </ion-label>`
  }),
  'payment-errored': () => ({
    header: 'Payment failed',
    message: `<ion-label>
      <p>Please try again</p>
      <p>Ensure your account is eligible to be deducted the desired amount</p>
    </ion-label>`
  }),
  'confirmation': (single: boolean) => ({
    header: 'Confirm your request',
    message: `<ion-label>
      <p>We will contact you shortly after to deliver your ${single ? 'item' : 'items'}</p>
    </ion-label>`,
    buttonText: 'Confirm'
  })
}

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
