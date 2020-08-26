import React from 'react'

import { IonAlert } from '@ionic/react'

type Props = {
  open: boolean,
  header: string,
  message: string,
  buttonText?: string,
  onConfirm: () => void
  onDismiss: () => void
}

const Component: React.FC<Props> = ({
  open,
  header,
  message,
  buttonText,
  onConfirm,
  onDismiss
}) => (
    <IonAlert
      isOpen={open}
      onWillDismiss={onDismiss}
      header={header || ''}
      message={message || ''}
      buttons={[
        {
          text: buttonText || 'Okay',
          handler: onConfirm
        }
      ]}
      cssClass="alert-custom"
    />
  )

export default Component