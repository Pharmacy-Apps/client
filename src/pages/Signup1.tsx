import React, { ChangeEvent } from 'react'
import Routes from 'routes'
import { History } from 'history'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as constants from 'reducers/constants'

import { IonContent, IonPage, IonList, IonItem, IonLabel, IonButton, IonItemDivider } from '@ionic/react'
import { Header, PhoneInput } from 'components'

import Requests, { endPoints } from 'requests'

import { CCs } from 'utils/msisdn'

export type Props = {
  history: History,
  showLoading: Function,
  hideLoading: Function,
  showToast: Function,
  hideToast: Function
}

class Component extends React.Component<Props> {

  state = { phone: null, phoneInputFocussed: false }

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

  onPhoneInputFocus = () => this.setState({ phoneInputFocussed: true })
  onPhoneInputBlur = () => this.setState({ phoneInputFocussed: false })

  render() {
    const { phone, phoneInputFocussed } = this.state
    const color = phoneInputFocussed ? 'primary' : undefined
    return (
      <IonPage>
        <Header omitsBack />
        <IonContent className="ion-padding">
          <form onSubmit={this.onSubmit}>
            <IonList className="ion-no-margin ion-no-padding">
              <IonItem lines="none">
                <IonLabel position="stacked" color={color}>Phone</IonLabel>
                {/* <IonInput onIonChange={this.onChange} value={phone} type="tel" name="phone" autocomplete="off" /> */}
                <PhoneInput
                  name="phone"
                  value={phone || ''}
                  onChange={this.onChange}
                  onFocus={this.onPhoneInputFocus}
                  onBlur={this.onPhoneInputBlur} />
              </IonItem>
              <IonItemDivider style={{ minHeight: 1 }} color={color} />
            </IonList>
            <div className="ion-padding">
              <IonButton expand="block" type="submit" className="ion-no-margin">Submit</IonButton>
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
