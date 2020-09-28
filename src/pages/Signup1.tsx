import React, { ChangeEvent } from 'react'
import Routes from 'routes'
import { History } from 'history'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as constants from 'reducers/constants'

import { IonContent, IonPage, IonList, IonItem, IonLabel, IonButton, IonItemDivider } from '@ionic/react'
import { Header, PhoneInput } from 'components'
import { HeadComponent } from './Login'

import Requests, { endPoints } from 'requests'

import { CCs } from 'utils/msisdn'

export type Props = {
  history: History,
  showLoading: Function,
  hideLoading: Function,
  showToast: Function,
  hideToast: Function
}

const header = 'Let\'s start'
const subHeader = 'Enter your phone number to receive a verification code'

class Component extends React.Component<Props> {

  state = { phone: null, inputFocussed: null }

  onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    this.setState({ ...this.state, [name]: value })
  }

  onSubmit = (e: any) => {
    e.preventDefault()
    const { showLoading, hideLoading, showToast, hideToast, history } = this.props
    const { phone: partPhone } = this.state
    if (partPhone) {
      hideToast()
      showLoading()
      const phone = `${CCs.ug.value}${partPhone}`
      Requests.post(endPoints.signup1, { phone }).then((response: any) => {
        console.info(response)
        history.push({
          pathname: Routes.signup2.path,
          state: { token: response.token, phone }
        })
      }).catch(err => {
        console.error(err)
        showToast(err.error || err.toString())
      }).finally(() => hideLoading())
    }
  }

  onInputFocus = (e: any) => {
    if (e)
      this.setState({ inputFocussed: e.target.name })
  }
  
  onInputBlur = () => this.setState({ inputFocussed: null })

  getIonLabelStyle = (name: string) => {
    return this.state.inputFocussed === name
      ? { color: 'var(--ion-color-action-primary)' }
      : {}
  }

  getIonItemDividerStyle = (name: string) => {
    const o = { minHeight: 1 }
    return this.state.inputFocussed === name
      ? { ...o, '--background': 'var(--ion-color-action-primary)' }
      : o
  }

  render() {
    const { phone } = this.state
    return (
      <IonPage>
        <Header omitsBack />
        <IonContent className="ion-padding">
          <HeadComponent header={header} subHeader={subHeader} />
          <form onSubmit={this.onSubmit}>
            <IonList className="ion-no-margin ion-no-padding">
              <IonItem lines="none">
                <IonLabel position="stacked" style={this.getIonLabelStyle('phone')}>Phone</IonLabel>
                {/* <IonInput onIonChange={this.onChange} value={phone} type="tel" name="phone" autocomplete="off" /> */}
                <PhoneInput
                  name="phone"
                  value={phone || ''}
                  onChange={this.onChange}
                  onFocus={this.onInputFocus}
                  onBlur={this.onInputBlur} />
              </IonItem>
              <IonItemDivider style={this.getIonItemDividerStyle('phone')} />
            </IonList>
            <div className="ion-padding">
              <IonButton
                expand="block"
                type="submit"
                className="ion-no-margin ion-action-primary">Next</IonButton>
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
