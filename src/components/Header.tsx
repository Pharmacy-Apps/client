import React from 'react'
import { IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton } from '@ionic/react'

const appName = 'App'

export type Props = {
  omitsBack?: boolean
  title?: string
}

const Component: React.FC<Props> = props => {
  return (
    <IonHeader>
      <IonToolbar>
        {props.omitsBack ? null : <IonButtons slot="start">
          <IonBackButton defaultHref="/" />
        </IonButtons>}
        <IonTitle>{props.title}</IonTitle>
      </IonToolbar>
    </IonHeader>
  )
}

Component.defaultProps = { title: appName }

export default Component