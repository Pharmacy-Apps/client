import React from 'react'
import { History } from 'history'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as constants from 'reducers/constants'

import {
  IonContent, IonPage, IonList, IonItem, IonLabel, IonIcon, IonItemDivider, IonAlert, IonButton
} from '@ionic/react'
import { starOutline as numb, star as active } from 'ionicons/icons'

import { Header } from 'components'
import { MSISDNModify as MSISDNModifyPopover } from 'containers'

import Requests, { endPoints } from 'requests'

import decrypt from 'utils/jwt'
import { formatUGMSISDN } from 'utils/msisdn'
import { getSessionToken, setSessionToken, getSessionPhone } from 'session'
import { formatMoney } from 'utils/currency'

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
  msisdnPopoverShown: boolean,
  amount: string,
  customOfferSelected: false
}

const title = 'Deposit to Wallet'
const amountInputPlaceholder = 'Type amount'

const minCustomAmount = 999

const message = <>
  <p>
    To deposit, please select one of the preset amounts or type your own; minimum {formatMoney(minCustomAmount + 1)}.<br />
    Then select the payment channel.
  </p>
</>

class Component extends React.Component<Props> {

  state: State = {
    offers: [],
    selectedOffer: null,
    alert: {
      shown: false, header: '', message: '', buttonText: '', confirmsPayment: false
    },
    msisdnPopoverShown: false,
    amount: '',
    customOfferSelected: false
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

  onAlertDismiss = () => {
    this.hideAlert()
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

  onOfferSelect = ({ _id }: Offer) => {
    this.setState({
      selectedOffer: _id, customOfferSelected: false, amount: ''
    })
  }

  onConfirmPaymentChannel = () => {
    const { showLoading, hideLoading, showToast } = this.props
    const {
      selectedOffer, offers, customOfferSelected, amount: value
    } = this.state

    const offer = customOfferSelected ? { value } : selectedOffer

    showLoading()
    Requests.post(endPoints['credits'], { offer }).then((response: any) => {
      const errored = false // Payment succeeded
      if (errored) {
        this.showAlert(AlertText['payment-errored']())
      } else {
        this.showAlert(AlertText['payment-succeeded']((
          customOfferSelected ? { value } : offers.find(({ _id }) => _id === offer) || {}
        ).value))
        this.setState({
          customOfferSelected: false, amount: ''
        })
      }
    }).catch(err => {
      console.error(err)
      showToast(err.error || err.toString())
    }).finally(hideLoading)
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

  onChangeAmountInput = ({ target: { value } }: any) => {
    try {
      if (/^[0-9]+$|^$/.test(value) === false) throw new Error('Value error')
      const amount = parseInt(value) || ''
      this.setState({
        amount,
        ...amount ? { customOfferSelected: amount > minCustomAmount } : {}
      })
    } catch (error) { }
  }

  onBlurAmountInput = () => {
    if (this.state.amount === '')
      this.setState({ customOfferSelected: false })
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
    const { offers, alert, selectedOffer, msisdnPopoverShown, amount, customOfferSelected } = this.state
    return offers.length ? (
      <IonPage>
        <Header title={title} />
        <IonContent className="ion-padding">
          <IonLabel>{message}</IonLabel>
          <IonList lines="full" className="ion-margin-top ion-no-padding">{
            offers.map(offer => (
              <IonItem
                key={offer._id}
                onClick={() => this.onOfferSelect(offer)}
                button
              >
                <IonIcon color="primary" icon={
                  offer._id === selectedOffer && !customOfferSelected ? active : numb
                } slot="start" />
                <IonLabel>
                  <h3>{formatMoney(offer.value)}</h3>
                </IonLabel>
              </IonItem>
            ))
          }
            <IonItem lines="none">
              <IonIcon color="primary" icon={customOfferSelected ? active : numb} slot="start" />
              <input
                className="custom-input"
                onChange={this.onChangeAmountInput}
                onBlur={this.onBlurAmountInput}
                value={amount}
                type="text" name="amount"
                placeholder={amountInputPlaceholder}
              />
            </IonItem>
          </IonList>
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
                <IonLabel>
                  <h3>{channel.name}</h3>
                  <p>{channel.description}</p>
                </IonLabel>
                {channel.requiresNumber ? <IonButton onClick={e => {
                  e.stopPropagation()
                  this.showMSISDNPopover()
                }} color="secondary" fill="clear">Change Number</IonButton> : null}
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
  'payment-succeeded': (credits: number) => ({
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
