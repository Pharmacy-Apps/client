import React from 'react'
import { IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton, IonIcon } from '@ionic/react'

import { ToolbarAction } from 'types'

import { APP_NAME, platformIsWebBrowser } from 'utils'

export type Props = {
  omitsBack?: boolean
  title?: any
  size?: 'small' | 'large'
  actions?: Array<ToolbarAction>
}

const buttonStyle = {
  textTransform: 'unset'
}

const Component: React.FC<Props> = ({ omitsBack: ob, title, size, actions = [] }) => {
  const omitsBack = ob || platformIsWebBrowser
  return (
    <IonHeader>
      <IonToolbar /* color="primary" */>
        {omitsBack ? null : <IonButtons slot="start">
          <IonBackButton color="primary" defaultHref="/" />
        </IonButtons>}
        <IonTitle size={size} color="primary">{title}</IonTitle>
        <IonButtons slot="secondary">{
          actions.map((
            { icon, text, component: Component, handler },
            i
          ) => Component ? <Component key={i} /> : <IonButton
            key={i}
            onClick={handler}
            style={buttonStyle}
          >
              {
                icon ? <IonIcon color="primary" icon={icon} /> : null
              }{
                text ? text : null
              }
            </IonButton>
          )
        }</IonButtons>
      </IonToolbar>
    </IonHeader>
  )
}

Component.defaultProps = { title: APP_NAME, size: 'large' }

export default Component