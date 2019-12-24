import React from 'react'
import { IonLoading } from '@ionic/react'

export type Props = {
  message?: string
}

const Component: React.FC<Props> = props => (
  <IonLoading
    isOpen={true}
    message={props.message}
  />
)

Component.defaultProps = { message: 'Please wait' }

export default Component