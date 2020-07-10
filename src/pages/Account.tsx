import React from 'react'
import Routes from 'routes'
import { History } from 'history'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as constants from 'reducers/constants'

import { IonContent, IonPage, IonList, IonItem, IonLabel, IonButton, IonText } from '@ionic/react'

import { Header } from 'components'

import Requests, { endPoints } from 'requests'
import { getSessionPhone, getSessionLocation } from 'session'

import { userIsClientUser } from 'utils/role'

type Props = {
  history: History,
  showLoading: () => {},
  hideLoading: () => {},
  showToast: (e: string) => {},
}

type Item = {
  name: string,
  value: any,
  action?: string,
  handler?: () => void,
  starred?: true,
  skipsAction?: true
}

const { lat, lon } = getSessionLocation()

/* 
 * To get address from coordinates,
 * Query here
 * https://maps.googleapis.com/maps/api/geocode/json?key=GEOCODE_API_KEY&latlng=44.4647452,7.3553838&sensor=true
 * 
 */

class Component extends React.Component<Props> {

  state = { credits: 0 }

  getListItems = () => {
    const { history } = this.props
    const { credits } = this.state

    const defaultItems: Array<Item> = [{
      name: 'Phone',
      value: getSessionPhone(),
      skipsAction: true
    }]

    const clientUserItems: Array<Item> = [{
      name: 'Credits',
      value: credits,
      action: 'Purchase Credits',
      handler: () => history.push(Routes.credit.path),
      starred: true
    }, {
      name: 'Last delivery location',
      value: `${lat}, ${lon}`,
      action: 'Update',
      handler: () => { }
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

  render() {
    return (
      <IonPage>
        <Header title="Account" />
        <IonContent>
          <IonList lines="full" className="ion-no-margin ion-no-padding">{
            this.getListItems().map((item, i, a) => {
              return <IonItem key={i} {...i + 1 === a.length ? { lines: "none" } : {}}>
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
