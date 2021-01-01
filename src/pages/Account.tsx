import React from 'react'
import Routes from 'routes'
import { History } from 'history'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as constants from 'reducers/constants'

import { IonContent, IonPage, IonList, IonItem, IonLabel, IonButton, IonIcon } from '@ionic/react'

import { Header, Popover } from 'components'
import { MSISDNModify as MSISDNModifyPopover } from 'containers'

import Requests, { endPoints } from 'requests'
import { getDeliveryAddressForNextOrder } from 'location'

import decrypt from 'utils/jwt'
import { formatUGMSISDN } from 'utils/msisdn'
import { getSessionToken, setSessionToken, getSessionPhone } from 'session'

import { userIsClientUser } from 'utils/role'
import { formatMoney } from 'utils/currency'

import { languages, setLanguage, getLanguage } from 'languages'

import { locationSharp as location, person, pushSharp as deposit, languageSharp as language, star } from 'ionicons/icons'

type Props = {
  history: History,
  showLoading: () => {},
  hideLoading: () => {},
  showToast: (e: string) => {},
}

type Item = {
  name: string,
  value: any,
  icon: string,
  actionText?: any,
  handler?: () => void
} | null

const address = getDeliveryAddressForNextOrder()

/* 
 * To get address from coordinates,
 * Query here
 * https://maps.googleapis.com/maps/api/geocode/json?key=GEOCODE_API_KEY&latlng=44.4647452,7.3553838&sensor=true
 * 
 */

const userIsClient = userIsClientUser()

let currentLanguage: string | null = null

class Component extends React.Component<Props> {

  state = { credits: 0, msisdnPopoverShown: false, languagePopoverShown: false }

  getListItems = () => {
    const { history } = this.props

    const mtnMSISDNKey = 'mtn-msisdn'
    const {
      [mtnMSISDNKey]: msisdn
    } = decrypt(getSessionToken())

    currentLanguage = (
      languages.find(({ value }) => value === getLanguage()) || languages[0]
    ).label

    const items: Array<Item> = [
      userIsClient ? {
        name: 'Wallet',
        value: formatMoney(this.state.credits),
        actionText: <IonIcon icon={deposit} />,
        handler: () => history.push(Routes.credit.path),
        icon: '/assets/icons/wallet.svg'
      } : null,
      userIsClient ? {
        name: 'Delivery location',
        value: address,
        actionText: address ? null : 'Set',
        handler: () => history.push(Routes.location.path),
        icon: location
      } : null,
      userIsClient && false ? {
        name: 'MTN account to debit',
        value: formatUGMSISDN(msisdn || getSessionPhone()),
        handler: this.showMSISDNPopover,
        icon: '/assets/icons/mobile-pay.svg'
      } : null,
      {
        name: 'Phone',
        value: formatUGMSISDN(getSessionPhone() || ''),
        icon: person
      },
      {
        name: 'Language',
        value: currentLanguage,
        handler: this.showLanguagePopover,
        icon: language
      }
    ]

    return items
  }

  componentDidMount() {
    const { showLoading, hideLoading, showToast } = this.props
    showLoading()
    Requests.get(endPoints['credits']).then((response: any) => {
      this.setState({ credits: response })
    }).catch(err => {
      console.error(err)
      showToast(err.error || err.toString())
    }).finally(hideLoading)
  }

  showMSISDNPopover = () => {
    this.setState({ msisdnPopoverShown: true })
  }

  hideMSISDNPopover = () => {
    this.setState({ msisdnPopoverShown: false })
  }

  showLanguagePopover = () => {
    this.setState({ languagePopoverShown: true })
  }

  hideLanguagePopover = () => {
    this.setState({ languagePopoverShown: false })
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

  onSelectLanguage = (language: string) => {
    setLanguage(language)
    this.hideLanguagePopover()
  }

  render() {
    const { msisdnPopoverShown, languagePopoverShown } = this.state
    return (
      <IonPage>
        <Header title="Profile" />
        <IonContent>
          <IonList lines="inset" className="ion-no-margin ion-no-padding">{
            this.getListItems().map((item, i, a) => {
              return item ? <IonItem
                {...i + 1 === a.length ? { lines: "none" } : {}}
                key={i}
                button={Boolean(item.handler)}
                onClick={item.handler}
              >
                <IonIcon icon={item.icon} className="ion-icon-primary" slot="start" />
                <IonLabel>
                  <p>{item.name}</p>
                  <h3 style={{
                    ...item.handler ? { color: 'var(--ion-color-primary)' } : {}
                  }}>{item.value}</h3>
                </IonLabel>
                {item.actionText ? <IonButton
                  {...item.handler ? {} : { fill: "clear" }}
                  type="button"
                  slot="end"
                  className={item.handler ? 'ion-no-margin ion-action-secondary' : 'ion-no-margin'}
                >{item.actionText}</IonButton> : null}
              </IonItem> : null
            })}</IonList>
          <MSISDNModifyPopover
            open={msisdnPopoverShown}
            onDismiss={this.hideMSISDNPopover}
            onSubmit={this.onSubmitChangeNumber} />
          <Popover
            open={languagePopoverShown}
            onDismiss={this.hideLanguagePopover}
          >
            <LanguagesComponent language={currentLanguage} onSelect={this.onSelectLanguage} />
          </Popover>
        </IonContent>
      </IonPage>
    )
  }

}

const LanguagesComponent: React.FC<{
  language: string | null,
  onSelect: (a1: string) => void
}> = ({
  language, onSelect
}) => (
      <IonList className="ion-no-padding">
        {
          languages.map(({ label, value, disabled = false, description = null }) =>
            <IonItem key={value} onClick={
              () => disabled ? null : onSelect(value)
            } button={!disabled}>
              <IonIcon icon={
                language === label ? star : 'no-icon'
              } size="small" className="ion-icon-primary" slot="start" />
              <IonLabel>
                {label}
                <p className="ion-label-primary">{description}</p>
              </IonLabel>
            </IonItem>)
        }
      </IonList>
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
  hideToast: () => ({
    type: constants.HIDE_TOAST
  })
}, dispatch)

export default connect(null, mapDispatchToProps)(Component)
