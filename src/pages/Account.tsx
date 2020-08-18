import React from 'react'
import Routes from 'routes'
import { History } from 'history'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as constants from 'reducers/constants'

import { IonContent, IonPage, IonList, IonItem, IonLabel, IonButton, IonText, IonIcon } from '@ionic/react'

import { Header } from 'components'
import { MSISDNModify as MSISDNModifyPopover } from 'containers'

import Requests, { endPoints } from 'requests'
import { getDeliveryLocationForNextOrder } from 'location'

import decrypt from 'utils/jwt'
import { formatUGMSISDN } from 'utils/msisdn'
import { getSessionToken, setSessionToken, getSessionPhone } from 'session'

import { userIsClientUser } from 'utils/role'

import { locationSharp as location, person } from 'ionicons/icons'

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
  action?: string,
  handler?: () => void,
  starred?: true,
  skipsAction?: true
}

const { lat, lon } = getDeliveryLocationForNextOrder()

/* 
 * To get address from coordinates,
 * Query here
 * https://maps.googleapis.com/maps/api/geocode/json?key=GEOCODE_API_KEY&latlng=44.4647452,7.3553838&sensor=true
 * 
 */

class Component extends React.Component<Props> {

  // credits: 0
  state = { msisdnPopoverShown: false }

  getListItems = () => {
    const { history } = this.props

    const defaultItems: Array<Item> = [{
      name: 'Phone',
      value: formatUGMSISDN(getSessionPhone() || ''),
      skipsAction: true,
      icon: person
    }]

    // {
    //   name: 'Credits',
    //   value: this.state.credits,
    //   action: 'Purchase Credits',
    //   handler: () => history.push(Routes.credit.path),
    //   starred: true
    // }

    const mtnMSISDNKey = 'mtn-msisdn'
    const {
      [mtnMSISDNKey]: msisdn
    } = decrypt(getSessionToken())

    const clientUserItems: Array<Item> = [{
      name: 'Delivery location',
      value: lat && lon ? `${lat}, ${lon}` : 'Not known yet',
      action: lat && lon ? 'Update' : 'Set',
      handler: () => history.push(Routes.location.path),
      icon: location
    }, {
      name: 'MTN account to debit',
      value: formatUGMSISDN(msisdn || getSessionPhone()),
      action: 'Change',
      handler: this.showMSISDNPopover,
      icon: '/assets/icons/mobile-pay.svg'
    }]

    return userIsClientUser()
      ? [
        ...clientUserItems,
        ...defaultItems
      ]
      : defaultItems
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

  render() {
    const { msisdnPopoverShown } = this.state
    return (
      <IonPage>
        <Header title="Profile" />
        <IonContent>
          <IonList lines="inset" className="ion-no-margin ion-no-padding">{
            this.getListItems().map((item, i, a) => {
              return <IonItem key={i} {...i + 1 === a.length ? { lines: "none" } : {}}>
                <IonIcon icon={item.icon} color="primary" slot="start" />
                <IonLabel>
                  <p>{item.name}</p>
                  <IonText {...item.starred ? { color: "primary" } : {}}>
                    <h2>{item.value}</h2>
                  </IonText>
                </IonLabel>
                {item.skipsAction ? null : <IonButton type="button" {...item.starred ? {} : { fill: "clear" }} className="ion-no-margin" slot="end" onClick={item.handler}>{
                  item.action
                }</IonButton>}
              </IonItem>
            })}</IonList>
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
