import React from 'react'
import { IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton } from '@ionic/react'

import { ToolbarAction } from 'types'

const appName = 'App'

export type Props = {
  omitsBack?: boolean
  title?: string | any
  actions?: ToolbarAction []
}

const Component: React.FC<Props> = ({ omitsBack, title, actions = [] }) => {
  return (
    <IonHeader>
      <IonToolbar>
        {omitsBack ? null : <IonButtons slot="start">
          <IonBackButton defaultHref="/" />
        </IonButtons>}
        <IonTitle>{title}</IonTitle>
        <IonButtons slot="secondary">{
          actions.map((action, i) => <IonButton key={i} onClick={e => action.handler(e)}>
            {action.component}
          </IonButton>)
        }</IonButtons>
      </IonToolbar>
    </IonHeader>
  )
}

Component.defaultProps = { title: appName }

export default Component