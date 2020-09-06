import React from 'react'
import Routes from 'routes'
import { History } from 'history'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as constants from 'reducers/constants'

import { IonContent, IonPage, IonList, IonItem, IonLabel, IonInput, IonButton } from '@ionic/react'
import { Header } from 'components'

import Requests, { endPoints } from 'requests'
import { setSessionToken, setSessionPhone } from 'session'

export type Props = {
  history: History,
  showLoading: Function,
  hideLoading: Function,
  showToast: Function,
  hideToast: Function
}

class Component extends React.Component<Props> {

  state = { code: null, password: null, name: null }

  onChange = (e: any) => {
    const { name, value } = e.target
    this.setState({ ...this.state, [name]: value })
  }

  onSubmit = (e: any) => {
    e.preventDefault()
    const {
      showLoading, hideLoading, showToast, hideToast,
      history: { location: { state: { token, phone } } }
    } = this.props
    const { code, password, name } = this.state
    if (code && password && name) {
      hideToast()
      showLoading()
      Requests.post(endPoints.signup2, { token, code, secret: password, name }).then((response: any) => {
        console.info(response)
        setSessionToken(response.token)
        setSessionPhone(phone)
        window.location.replace(Routes.home.path)
      }).catch(err => {
        console.error(err)
        showToast(err.error || err.toString())
      }).finally(() => hideLoading())
    }
  }

  render() {
    const { code, password, name } = this.state
    return (
      <IonPage>
        <Header />
        <IonContent className="ion-padding">
          <form onSubmit={this.onSubmit}>
            <IonList lines="full" className="ion-no-margin ion-no-padding">
              <IonItem>
                <IonLabel position="floating">Verification code</IonLabel>
                <IonInput onIonChange={this.onChange} value={code} type="text" name="code" autocomplete="off" />
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Password you will use</IonLabel>
                <IonInput onIonChange={this.onChange} value={password} type="text" name="password" autocomplete="off" />
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Your name</IonLabel>
                <IonInput onIonChange={this.onChange} value={name} type="text" name="name" autocomplete="off" />
              </IonItem>
            </IonList>
            <div className="ion-padding">
              <IonButton
                expand="block"
                type="submit"
                className="ion-no-margin ion-action-primary">Submit</IonButton>
            </div>
          </form>
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
