import React from 'react'

import { IonPage } from '@ionic/react'

const { REACT_APP_SPLASH_URL } = process.env

type Props = {
  rendered: Boolean
}

const Component: React.FC<Props> = ({ rendered }) => {

  const imageSrc = REACT_APP_SPLASH_URL

  return <IonPage style={{
    height: '100%',
    width: '100%',
    backgroundImage: `url(${imageSrc})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'contain',
    opacity: rendered ? 1 : 0,
    transition: 'opacity 1s'
  }} />

}

export default Component
