import React, { useState, Dispatch, SetStateAction } from 'react'
import { History } from 'history'

import Map from 'google-map-react'

import { Header } from 'components'
import { IonContent, IonPage, IonButton, IonIcon } from '@ionic/react'
import { locationSharp as locationIcon } from 'ionicons/icons'

import { getMapKey, CentralLocation } from 'location'
import { getSessionLocation, getLastAttemptedDeliveryLocation, setDeliveryLocation } from 'session'

const title = 'Destination'
const primaryAction = 'Select this location'

const actionButtonStyle = {
  position: 'absolute',
  bottom: 0
}

const markerStyle = {
  width: '30px',
  height: '30px',
  position: 'absolute',
  top: 'calc(50% - 30px)',
  left: 'calc(50% - 15px)'
}

type LocationInterface = { lat: number, lon: number }

const Component: React.FC<{
  history: History
}> = ({ history }) => {
  type i = [LocationInterface | null, Dispatch<SetStateAction<any>>]
  const [location, setLocation]: i = useState(null)

  const onPrimaryAction = () => {
    if (location) setDeliveryLocation(location)
    history.goBack()
  }
  return (
    <IonPage>
      <Header title={title} />
      <IonContent>
        <MapContainer setLocation={setLocation} />
        <IonIcon style={markerStyle} icon={locationIcon} />
        <IonButton onClick={onPrimaryAction} style={actionButtonStyle} className="ion-margin">{primaryAction}</IonButton>
      </IonContent>
    </IonPage>
  )
}

const mapKey = getMapKey()

type Props = { setLocation: (location: LocationInterface) => void }

class MapContainer extends React.Component<Props> {

  mapCenter = getLastAttemptedDeliveryLocation() || getSessionLocation() || CentralLocation

  mapDefaults = {
    center: {
      lat: this.mapCenter.lat,
      lng: this.mapCenter.lon
    },
    zoom: 15
  }

  onChange = ({ center: { lat, lng }, zoom }: any) => {
    this.props.setLocation({ lat, lon: lng })
  }

  onDragEnd = ({ center: { lat, lng } }: any) => {
    this.props.setLocation({ lat: lat(), lon: lng() })
  }

  render() {
    return (<div style={{ height: '100%', width: '100%' }}>
      <Map
        bootstrapURLKeys={{ key: mapKey }}
        center={this.mapDefaults.center}
        zoom={this.mapDefaults.zoom}
        onDragEnd={this.onDragEnd}
        options={{
          zoomControl: false,
          fullscreenControl: false
        }}
      />
    </div >)
  }

}

export default Component
