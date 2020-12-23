import React from 'react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as constants from 'reducers/constants'

import {
  IonContent, IonPage,
  IonCard, IonCardHeader, IonCardSubtitle, IonCardContent,
  IonList, IonItem, IonLabel, IonIcon, IonListHeader
} from '@ionic/react'

import { Header } from 'components'

import { FileServer, endPoints } from 'requests'
import { sessionAvailable as isSessionAvailable } from 'session'

// import { userIsClientUser } from 'utils/role'

import { APP_NAME, APP_VERSION } from 'utils'

import { FAQ } from 'types'
import getPageText from 'text'

/* 
 * How it works, FAQs, Contacts
 * 
 */

const Text = getPageText('about')

const sessionAvailable = isSessionAvailable()

const steps = [
  'Request for any item initially selecting one of the categories',
  'Choose a delivery location',
  'Make payment or pay on delivery'
]

const contacts = [{
  header: 'Call Customer Care',
  description: <span>{['0312 300200', '0312 239000'].join(',  ')}</span>,
  action: () => null
}, {
  header: 'Send email',
  description: null,
  action: () => null
}, {
  header: 'Visit',
  description: null
}]

const faqAnswerStyle = (show: boolean) => ({
  height: show ? undefined : 0
})

const ionItemStyle = {
  '--min-height': 0
}

export type Props = {
  showLoading: () => {},
  hideLoading: () => {}
}

type State = {
  faqs?: Array<FAQ>,
  openFAQs: Array<number>
}

class Component extends React.Component<Props> {

  state: State = { openFAQs: [] }

  componentDidMount() {
    this.fetchFAQs()
  }

  fetchFAQs = async () => {
    const { showLoading, hideLoading } = this.props
    showLoading()
    const faqs = await FileServer.get(endPoints.faqs)
    this.setState({ faqs }, hideLoading)
  }

  onFAQSelected = (i: number) => {
    const { openFAQs } = this.state
    const index = openFAQs.indexOf(i)
    if (index < 0) {
      openFAQs.push(i)
    } else {
      openFAQs.splice(index, 1)
    }
    this.setState({ openFAQs })
  }

  render() {

    const { faqs = [], openFAQs } = this.state

    return (
      <IonPage>
        <Header title={Text.title} />
        <IonContent className="ion-padding">
          <IonLabel>
            <IonList lines="none" className="ion-no-padding">
              <IonItem className="ion-no-padding" style={ionItemStyle}>
                <h3>{APP_NAME} securely fast delivers medical items right to where you choose</h3>
              </IonItem>
              <IonItem className="ion-no-padding ion-margin-vertical" style={ionItemStyle}>
                <h3>{
                  sessionAvailable
                    ? `Get started in ${steps.length} quick steps`
                    : `
                      Set up an account with your telephone number
                      and enjoy this service in ${steps.length} quick steps
                    `
                }</h3>
              </IonItem>{
                steps.map((step, i) => (
                  <IonItem key={i} className="ion-align-items-start ion-no-padding ion-margin-vertical" style={ionItemStyle}>
                    <h3 style={{ marginInlineEnd: '8px' }} className="ion-label-primary">{i + 1}.</h3>
                    <h3 className="ion-label-primary">{step}</h3>
                  </IonItem>
                ))
              }</IonList>
          </IonLabel>
          <IonCard className="ion-no-margin ion-margin-top">
            <IonCardHeader className="ion-no-padding ion-padding-top ion-padding-horizontal">
              <IonCardSubtitle>
                <IonItem className="ion-no-padding" lines="none">
                  <IonIcon slot="start" className="ion-icon-secondary" icon="/assets/icons/help.svg" />
                  Frequently Asked Questions
                </IonItem>
              </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList lines="full">{
                faqs.map(({ header, qn, ans }, i, a) => {

                  if (header) return <IonListHeader key={i} lines="full">{
                    header
                  }</IonListHeader>

                  return <IonItem
                    key={i}
                    lines={(
                      i === a.length - 1 || (
                        a[i + 1] && a[i + 1].header
                      )
                    ) ? 'none' : undefined}
                    onClick={() => this.onFAQSelected(i)}
                    button
                    className="no-ripple"
                  >
                    <IonLabel>
                      <h3 className="ion-label-primary ion-text-wrap">{qn}</h3>
                      <h3
                        className="ion-text-wrap"
                        style={faqAnswerStyle(openFAQs.includes(i))}
                      >{ans}</h3>
                    </IonLabel>
                  </IonItem>
                })
              }</IonList>
            </IonCardContent>
          </IonCard>
          <IonCard className="ion-no-margin ion-margin-top">
            <IonCardHeader className="ion-no-padding ion-padding-top ion-padding-horizontal">
              <IonCardSubtitle>
                <IonItem className="ion-no-padding" lines="none">
                  <IonIcon slot="start" className="ion-icon-secondary" icon="/assets/icons/contact.svg" />
                  Contact Us
                </IonItem>
              </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList lines="full">{
                contacts.map(({ header, description, action }, i, a) => (
                  <IonItem
                    key={i}
                    lines={i + 1 < a.length ? undefined : 'none'}
                    button={Boolean(action)}
                    onClick={action}
                  >
                    <IonLabel>
                      <h3 className="ion-label-primary">{header}</h3>
                      <p>{description}</p>
                    </IonLabel>
                  </IonItem>
                ))
              }</IonList>
            </IonCardContent>
          </IonCard>

          <div style={{
            margin: 'calc(3 * var(--ion-margin)) 0'
          }}>
            <IonLabel>
              <h2 className="ion-text-center ion-label-secondary">
                {APP_NAME}&nbsp;&nbsp;{`v${APP_VERSION}`}
              </h2>
            </IonLabel>
          </div>

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
  })
}, dispatch)

export default connect(null, mapDispatchToProps)(Component)
