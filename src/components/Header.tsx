import React from 'react'
import { IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton, IonIcon } from '@ionic/react'

import { ToolbarAction } from 'types'

const appName = 'MediStore'

export type Props = {
  omitsBack?: boolean
  title?: any
  size?: 'small' | 'large'
  actions?: Array<ToolbarAction>
}

const buttonStyle = {
  textTransform: 'unset'
}

const Component: React.FC<Props> = ({ omitsBack, title, size, actions = [] }) => {
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

Component.defaultProps = { title: appName, size: 'large' }

export default Component