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
import { getDeliveryLocationForNextOrder } from 'location'

import decrypt from 'utils/jwt'
import { formatUGMSISDN } from 'utils/msisdn'
import { getSessionToken, setSessionToken, getSessionPhone } from 'session'

import { userIsClientUser } from 'utils/role'
import { getAddress } from 'utils'
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
  handler?: () => void,
  starred?: true
} | null

const { lat, lon } = getDeliveryLocationForNextOrder()

/* 
 * To get address from coordinates,
 * Query here
 * https://maps.googleapis.com/maps/api/geocode/json?key=GEOCODE_API_KEY&latlng=44.4647452,7.3553838&sensor=true
 * 
 */

class Component extends React.Component<Props> {

  state = { credits: 0, msisdnPopoverShown: false, languagePopoverShown: false }

  getListItems = () => {
    const { history } = this.props

    const mtnMSISDNKey = 'mtn-msisdn'
    const {
      [mtnMSISDNKey]: msisdn
    } = decrypt(getSessionToken())

    const userIsClient = userIsClientUser()

    const currentLanguage = (
      languages.find(({ value }) => value === getLanguage()) || languages[0]
    ).label

    const items: Array<Item> = [
      userIsClient ? {
        name: 'Wallet',
        value: formatMoney(this.state.credits),
        actionText: <IonIcon icon={deposit} />,
        handler: () => history.push(Routes.credit.path),
        starred: true,
        icon: '/assets/icons/wallet.svg'
      } : null,
      userIsClient ? {
        name: 'Delivery location',
        value: getAddress(lat, lon),
        actionText: lat && lon ? <IonIcon src="assets/icons/edit.svg" /> : 'Set',
        handler: () => history.push(Routes.location.path),
        icon: location
      } : null,
      userIsClient ? {
        name: 'MTN account to debit',
        value: formatUGMSISDN(msisdn || getSessionPhone()),
        actionText: <IonIcon src="assets/icons/edit.svg" />,
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
        actionText: <IonIcon src="assets/icons/edit.svg" />,
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
              return item ? <IonItem key={i} {...i + 1 === a.length ? { lines: "none" } : {}}>
                <IonIcon icon={item.icon} color="primary" slot="start" />
                <IonLabel>
                  <p>{item.name}</p>
                  <h3 style={{
                    ...item.starred ? { color: 'var(--ion-color-primary)' } : {}
                  }}>{item.value}</h3>
                </IonLabel>
                {item.actionText ? <IonButton type="button" {...item.starred ? {} : { fill: "clear" }} className="ion-no-margin" slot="end" onClick={item.handler}>{
                  item.actionText
                }</IonButton> : null}
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
            <LanguagesComponent language={getLanguage()} onSelect={this.onSelectLanguage} />
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
          languages.map(({ label, value }) =>
            <IonItem key={value} onClick={() => onSelect(value)} button>
              <IonIcon icon={
                language === value ? star : 'no-icon'
              } size="small" color="primary" slot="start" />
              {label}
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
