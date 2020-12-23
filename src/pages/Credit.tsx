import React from 'react'
import { History } from 'history'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as constants from 'reducers/constants'

import {
  IonContent, IonPage, IonList, IonItem, IonLabel, IonIcon, IonItemDivider, IonButton
} from '@ionic/react'
import { starOutline as numb, star as active } from 'ionicons/icons'

import { Header, Alert } from 'components'
import { MSISDNModify as MSISDNModifyPopover } from 'containers'

import Requests, { endPoints } from 'requests'

import decrypt from 'utils/jwt'
import { formatUGMSISDN, mtnMSISDNStorageKey as mtnMSISDNKey } from 'utils/msisdn'
import { getSessionToken, setSessionToken, getSessionPhone } from 'session'
import { formatMoney } from 'utils/currency'

import { CreditOffer as Offer, PaymentChannel as Channel } from 'types'

type Props = {
  history: History,
  showLoading: () => {},
  hideLoading: () => {},
  showToast: (e: string) => {},
}

const title = 'Deposit to Wallet'
const amountInputPlaceholder = 'Type amount'

const minCustomAmount = 1000

const message = <>
  <p>
    To deposit, please select one of the preset amounts or type your own; minimum {formatMoney(minCustomAmount)}<br />
    Then select the payment channel
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
    const {
      [mtnMSISDNKey]: msisdn
    } = decrypt(getSessionToken())
    const { header, message } = AlertText[id](formatUGMSISDN(msisdn || getSessionPhone()))
    this.showAlert({ header, message, confirmsPayment: true })
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
      const errored = true // Payment succeeded
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
        ...amount ? { customOfferSelected: amount > minCustomAmount - 1 } : {}
      })
    } catch (error) { }
  }

  onBlurAmountInput = () => {
    if (this.state.amount === '')
      this.setState({ customOfferSelected: false })
  }

  getChannels = () => {
    // const {
    //   [mtnMSISDNKey]: msisdn
    // } = decrypt(getSessionToken())
    return [{
      _id: 'mtn',
      name: 'MTN Mobile Money',
      // description: <span className="ion-label-primary">{
      //   formatUGMSISDN(msisdn || getSessionPhone())
      // }</span>,
      // requiresNumber: true,
      unavailable: true
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
                <IonIcon className="ion-icon-primary" icon={
                  offer._id === selectedOffer && !customOfferSelected ? active : numb
                } slot="start" />
                <IonLabel>
                  <h3>{formatMoney(offer.value)}</h3>
                </IonLabel>
              </IonItem>
            ))
          }
            <IonItem lines="none">
              <IonIcon className="ion-icon-primary" icon={customOfferSelected ? active : numb} slot="start" />
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
                onClick={
                  channel.unavailable ? undefined : () => this.onPaymentChannelSelect(channel)
                }
                button
                lines={i === a.length - 1 ? 'none' : undefined}
              >
                <IonLabel>
                  <h3>{channel.name}</h3>
                  <p className="ion-label-primary">{
                    channel.description || (
                      channel.unavailable ? 'Coming soon' : null
                    )
                  }</p>
                </IonLabel>
                {channel.requiresNumber ? <IonButton onClick={e => {
                  e.stopPropagation()
                  this.showMSISDNPopover()
                }} fill="clear">
                  <IonIcon className="ion-icon-secondary" icon="/assets/icons/edit-secondary.svg" />
                </IonButton> : null}
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

type AlertState = {
  shown?: boolean,
  header: string,
  message: string,
  buttonText?: string,
  confirmsPayment?: boolean
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

const AlertText: ({
  [key: string]: ((e?: any) => ({
    header: string,
    message: string
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
  'mtn': (account: string) => ({
    header: 'MTN Mobile Money',
    message: `<ion-label>
      <p>We will charge the account: <span class="ion-label-secondary">${account}</span></p>
      <p>When prompted, approve the transaction with your MTN Mobile Money PIN</p>
      <p>If you do not receive the prompt, dial MTN Mobile Money, *165# -> My Account -> My Approvals</p>
    </ion-label>`
  }),
  'airtel': () => ({
    header: 'Airtel Money',
    message: `<ion-label>
      <p>Dial Airtel Money, *185# -> Payments</p>
    </ion-label>`
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
