import React from 'react'
import Routes, { getDefaultRoute } from 'routes'
import { History } from 'history'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as constants from 'reducers/constants'

import {
  IonContent, IonPage, IonList, IonItem, IonLabel,
  IonInput, IonButton, IonItemDivider
} from '@ionic/react'

import { ellipsisVertical as more } from 'ionicons/icons'

import { Header, PhoneInput, Menu } from 'components'

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

const header = 'Welcome!'
const subHeader = 'Provide your phone and password to sign in'

class Component extends React.Component<Props> {

  state = { phone: null, inputFocussed: null, password: null }

  // state = { phone: '773828773', inputFocussed: null, password: '773828773' } // client user
  // state = { phone: '773828774', inputFocussed: null, password: '773828773' } // courier
  // state = { phone: '773828775', inputFocussed: null, password: '773828773' } // admin

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

  onInputFocus = (e: any) => {
    if (e)
      this.setState({ inputFocussed: e.target.name })
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

  toolbarActions = () => [{
    icon: more,
    handler: (event: any) => this.menuRef.open({ target: event.target })
  }]

  menuRef: any

  menuActions = () => [
    {
      text: 'About Us',
      handler: () => this.props.history.push(Routes.about.path)
    },
    /* How it works, FAQs, Contacts */
    { text: 'Key Partners', handler: () => null },
    /* List partners with some description */
    { text: 'Terms & Conditions', handler: () => this.props.history.push(Routes.tcs.path) }
    /* Terms of operation, Privacy policy */
  ]

  render() {
    const { phone, password } = this.state
    return (
      <IonPage>
        <Header omitsBack actions={this.toolbarActions()} />
        <Menu
          setRef={(node: any) => this.menuRef = node}
          actions={this.menuActions()}
        />
        <IonContent>
          <HeadComponent header={header} subHeader={subHeader} />
          <form onSubmit={this.onSubmit}>
            <IonList className="ion-no-margin ion-no-padding">
              <IonItem lines="none">
                <IonLabel style={this.getIonLabelStyle('phone')} position="stacked">Phone</IonLabel>
                <PhoneInput
                  name="phone"
                  value={phone || ''}
                  onChange={this.onChange}
                  onFocus={this.onInputFocus}
                  onBlur={this.onInputBlur}
                  onKeyUp={this.onKeyUp} />
              </IonItem>
              <IonItemDivider style={this.getIonItemDividerStyle('phone')} />
              <IonItem lines="none">
                <IonLabel style={this.getIonLabelStyle('password')} position="stacked">Password</IonLabel>
                <IonInput
                  onIonChange={this.onChange}
                  onIonFocus={this.onInputFocus}
                  onIonBlur={this.onInputBlur}
                  onKeyUp={this.onKeyUp} value={password} type="password" name="password" />
              </IonItem>
              <IonItemDivider style={this.getIonItemDividerStyle('password')} />
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

export const HeadComponent: React.FC<{
  header: string,
  subHeader: string
}> = ({
  header,
  subHeader
}) => (<>
  <IonItem lines="none" className="ion-margin-bottom">
    <IonLabel className="ion-text-wrap ion-head">
      {/* <h1>{header}</h1> */}
      <p>{subHeader}</p>
    </IonLabel>
  </IonItem>
  {/* <IonItemDivider className="ion-margin-vertical" style={{
    minHeight: .4,
    '--background': 'var(--ion-color-label-secondary)'
  }} /> */}
</>)