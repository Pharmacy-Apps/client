import React from 'react'
import Routes from 'routes'
import { History } from 'history'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as constants from 'reducers/constants'

import {
  IonContent, IonPage, IonList, IonItem, IonLabel,
  IonInput, IonButton, IonItemDivider
} from '@ionic/react'

import { Link } from 'react-router-dom'

import { Header } from 'components'
import { HeadComponent } from './Login'

import Requests, { endPoints } from 'requests'
import { setSessionToken, setSessionPhone } from 'session'

import { APP_NAME } from 'utils'

export type Props = {
  history: History,
  showLoading: Function,
  hideLoading: Function,
  showToast: Function,
  hideToast: Function
}

const header = 'Almost there'
const subHeader = 'Enter the verification code you received, a password you use to login and your name'

class Component extends React.Component<Props> {

  state = { code: null, password: null, name: null, inputFocussed: null }

  onChange = (e: any) => {
    const { name, value } = e.target
    this.setState({ ...this.state, [name]: value })
  }

  onSubmit = (e: any) => {
    
    e.preventDefault()
    if (this.props.history.location.state === undefined) return

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

  onInputFocus = (e: any) => {
    if (e) {
      const { name, value } = e.target
      this.setState({ inputFocussed: name, [name]: value })
    }
  }

  onInputBlur = () => this.setState({ inputFocussed: null })

  onKeyUp = (e: any) =>
    e.keyCode === 13 && this.onSubmit({ preventDefault: () => null })

  getIonLabelStyle = (name: string) => {
    return this.state.inputFocussed === name
      ? { color: 'var(--ion-color-action-primary)' }
      : {}
  }

  getIonItemDividerStyle = (name: string) => {
    const o = { minHeight: .1 }
    return this.state.inputFocussed === name
      ? { ...o, '--background': 'var(--ion-color-primary)' }
      : o
  }

  render() {
    const { code, password, name } = this.state
    return (
      <IonPage>
        <Header />
        <IonContent>
          <HeadComponent header={header} subHeader={subHeader} />
          <form onSubmit={this.onSubmit} autoComplete="off">
            <IonList className="ion-no-margin ion-no-padding">
              <IonItem lines="none">
                <IonLabel position="floating" style={this.getIonLabelStyle('code')}>Verification code</IonLabel>
                <IonInput
                  onIonChange={this.onChange}
                  onIonFocus={this.onInputFocus}
                  onIonBlur={this.onInputBlur}
                  onKeyUp={this.onKeyUp} value={code} type="text" name="code" />
              </IonItem>
              <IonItemDivider style={this.getIonItemDividerStyle('code')} />
              <IonItem lines="none">
                <IonLabel position="floating" style={this.getIonLabelStyle('password')}>Password you will use</IonLabel>
                <IonInput
                  onIonChange={this.onChange}
                  onIonFocus={this.onInputFocus}
                  onIonBlur={this.onInputBlur}
                  onKeyUp={this.onKeyUp} value={password} type="text" name="password" />
              </IonItem>
              <IonItemDivider style={this.getIonItemDividerStyle('password')} />
              <IonItem lines="none">
                <IonLabel position="floating" style={this.getIonLabelStyle('name')}>Your name</IonLabel>
                <IonInput
                  onIonChange={this.onChange}
                  onIonFocus={this.onInputFocus}
                  onIonBlur={this.onInputBlur}
                  onKeyUp={this.onKeyUp} value={name} type="text" name="name" />
              </IonItem>
              <IonItemDivider style={this.getIonItemDividerStyle('name')} />

              <IonItem className="ion-margin-top">
                <IonLabel><h3 className="ion-label-primary">
                  By completing signup and using {APP_NAME}, you are bound by the terms, conditions and privacy policy stated&nbsp;
                  <Link to={Routes.tcs.path}>here</Link>
                </h3></IonLabel>
              </IonItem>

            </IonList>
            <div className="ion-padding">
              <IonButton
                expand="block"
                type="submit"
                className="ion-no-margin ion-action-primary">Complete Signup</IonButton>
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
