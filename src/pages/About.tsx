import React from 'react'

import {
  IonContent, IonPage,
  IonCard, IonCardHeader, IonCardSubtitle, IonCardContent,
  IonList, IonItem, IonLabel, IonIcon, IonListHeader
} from '@ionic/react'

import { Header } from 'components'

import { sessionAvailable as isSessionAvailable } from 'session'

// import { userIsClientUser } from 'utils/role'

import { APP_NAME, APP_VERSION } from 'utils'

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

const defaultFAQAnswer = 'Loren Ipsum, Answer not available yet'

const faqs = [{
  header: 'Request items'
}, {
  qn: 'Where do the medical items come from?',
  ans: defaultFAQAnswer
}, {
  qn: 'Are the medical items approved by the Ministry of Health?',
  ans: defaultFAQAnswer
}, {
  qn: 'How do I verify integrity of the items from the courier?',
  ans: defaultFAQAnswer
}, {
  header: 'Request'
}, {
  qn: 'How long does it take to deliver my request?',
  ans: defaultFAQAnswer
}, {
  qn: 'How do I pay?',
  ans: defaultFAQAnswer
}, {
  qn: 'How do I contact the courier regarding my request?',
  ans: defaultFAQAnswer
}, {
  header: 'Account'
}, {
  qn: 'How do I create an account?',
  ans: defaultFAQAnswer
}, {
  qn: 'I forgot my password, how do I login?',
  ans: defaultFAQAnswer
}, {
  header: 'Others'
}, {
  qn: 'When do you open and close?',
  ans: defaultFAQAnswer
}]

const ionItemStyle = {
  '--min-height': 0
}

class Component extends React.Component {

  state = { openFAQs: [] as Array<number> }

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

    const { openFAQs } = this.state

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
                faqs.map(({ header, qn, ans }, i, a) => (
                  header ? <IonListHeader key={i} lines="full">{
                    header
                  }</IonListHeader> : <IonItem
                    key={i}
                    lines={(
                      i === a.length - 1 || (
                        a[i + 1] && a[i + 1].header
                      )
                    ) ? 'none' : undefined}
                    button
                    onClick={() => this.onFAQSelected(i)}
                  >
                      <IonLabel>
                        <h3 className="ion-label-primary ion-text-wrap">{qn}</h3>
                        <h3 className="ion-text-wrap ion-text-wrap">{
                          openFAQs.includes(i) ? ans : null
                        }</h3>
                      </IonLabel>
                    </IonItem>
                ))
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

export default Component
