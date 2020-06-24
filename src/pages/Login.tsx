import React from 'react'
import Routes from 'routes'
import { History } from 'history'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as constants from 'reducers/constants'

import { IonContent, IonPage, IonList, IonItem, IonLabel, IonInput, IonButton} from '@ionic/react'
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

  // state = { phone: null, password: null }
  state = { phone: '773828773', password: '773828773' }

  onChange = (e: any) => {
    const { name, value } = e.target
    this.setState({ ...this.state, [name]: value })
  }

  onSubmit = (e: any) => {
    e.preventDefault()
    const { showLoading, hideLoading, showToast, hideToast } = this.props
    const { phone, password } = this.state
    if (phone && password) {
      hideToast()
      showLoading()
      Requests.post(endPoints.login, { phone, secret: password }).then((response: any) => {
        setSessionToken(response.token)
        setSessionPhone(phone || '')
        window.location.replace(Routes.home.path)
      }).catch(err => {
        console.error(err)
        showToast(err.error || err.toString())
      }).finally(() => hideLoading())
    }
  }

  onCreateAccount = () => {
    this.props.history.push(Routes.signup1.path)
  }

  render() {
    const { phone, password } = this.state
    return (
      <IonPage>
        <Header omitsBack />
        <IonContent className="ion-padding">
          <form onSubmit={this.onSubmit}>
            <IonList lines="full" className="ion-no-margin ion-no-padding">
              <IonItem>
                <IonLabel position="floating">Phone</IonLabel>
                <IonInput onIonChange={this.onChange} value={phone} type="tel" name="phone" autocomplete="off" />
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Password</IonLabel>
                <IonInput onIonChange={this.onChange} value={password} type="password" name="password" autocomplete="off" />
              </IonItem>
            </IonList>
            <div className="ion-padding">
              <IonButton expand="block" type="submit" className="ion-no-margin">Submit</IonButton>
            </div>
            <div className="ion-padding">
              <IonButton onClick={this.onCreateAccount} expand="block" type="button" className="ion-no-margin" fill="clear">Create account</IonButton>
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
