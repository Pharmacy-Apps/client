import React from 'react'
import Routes, { getDefaultRoute } from 'routes'
import { History } from 'history'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as constants from 'reducers/constants'

import { IonContent, IonPage, IonList, IonItem, IonLabel, IonInput, IonButton, IonItemDivider } from '@ionic/react'
import { Header, PhoneInput } from 'components'

import Requests, { endPoints } from 'requests'
import { setSessionToken, setSessionPhone } from 'session'

import { CCs } from 'utils/msisdn'

export type Props = {
  history: History,
  showLoading: Function,
  hideLoading: Function,
  showToast: Function,
  hideToast: Function
}

class Component extends React.Component<Props> {

  // state = { phone: null, phoneInputFocussed: false, password: null }
  state = { phone: '773828773', phoneInputFocussed: false, password: '773828773' } // client user
  // state = { phone: '773828774', phoneInputFocussed: false, password: '773828773' } // courier
  // state = { phone: '773828775', phoneInputFocussed: false, password: '773828773' } // admin

  onChange = (e: any) => {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  onSubmit = (e: any) => {
    e.preventDefault()
    const { showLoading, hideLoading, showToast, hideToast } = this.props
    const { phone: partPhone, password } = this.state
    if (partPhone && password) {
      hideToast()
      showLoading()
      const phone = `${CCs.ug.value}${partPhone}`
      Requests.post(endPoints.login, { phone, secret: password }).then(({ token }: any) => {
        setSessionToken(token)
        setSessionPhone(phone)
        window.location.replace(getDefaultRoute(token))
      }).catch(err => {
        console.error(err)
        showToast(err.error || err.toString())
      }).finally(() => hideLoading())
    }
  }

  onCreateAccount = () => {
    this.props.history.push(Routes.signup1.path)
  }

  onPhoneInputFocus = () => this.setState({ phoneInputFocussed: true })
  onPhoneInputBlur = () => this.setState({ phoneInputFocussed: false })

  render() {
    const { phone, password, phoneInputFocussed } = this.state
    const color = phoneInputFocussed ? 'primary' : undefined
    return (
      <IonPage>
        <Header omitsBack />
        <IonContent className="ion-padding">
          <form onSubmit={this.onSubmit}>
            <IonList lines="full" className="ion-no-margin ion-no-padding">
              <IonItem lines="none">
                <IonLabel position="stacked" color={color}>Phone</IonLabel>
                {/* <IonInput onIonChange={this.onChange} value={phone} name="phone" /> */}
                <PhoneInput
                  name="phone"
                  value={phone || ''}
                  onChange={this.onChange}
                  onFocus={this.onPhoneInputFocus}
                  onBlur={this.onPhoneInputBlur} />
              </IonItem>
              <IonItemDivider style={{ minHeight: 1 }} color={color} />
              <IonItem>
                <IonLabel position="stacked">Password</IonLabel>
                <IonInput onIonChange={this.onChange} value={password} type="password" name="password" autocomplete="off" />
              </IonItem>
            </IonList>
            <div className="ion-padding">
              <IonButton
                expand="block"
                type="submit"
                className="ion-no-margin ion-action-primary">Submit</IonButton>
            </div>
            <div className="ion-padding">
              <IonButton
                onClick={this.onCreateAccount}
                expand="block"
                type="button"
                color="secondary"
                className="ion-no-margin"
                fill="clear">Create account</IonButton>
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
