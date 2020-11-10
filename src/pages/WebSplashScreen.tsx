import React from 'react'

import { IonPage } from '@ionic/react'

const { REACT_APP_SPLASH_URL } = process.env

const Component: React.FC = () => {

  const imageSrc = REACT_APP_SPLASH_URL

  return <IonPage style={{
    height: '100%',
    width: '100%',
    backgroundImage: `url(${imageSrc})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'contain'
  }} />

}

export default Component
