import React from 'react'

import { IonPopover } from '@ionic/react'

type Props = {
  open: boolean,
  onPresent?: () => void,
  onDismiss?: () => void,
  cssClass?: string
}

const Component: React.FC<Props> = ({ open, onPresent, onDismiss, cssClass, children }) => (
  <IonPopover
    isOpen={open}
    onDidPresent={onPresent}
    onDidDismiss={onDismiss}
    cssClass={cssClass}
  >
    {
      children
    }
  </IonPopover>
)

export default Component
