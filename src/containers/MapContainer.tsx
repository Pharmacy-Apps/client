import React from 'react'
import Map from 'google-map-react'

import { IonIcon } from '@ionic/react'
import { locationSharp as locationIcon } from 'ionicons/icons'

import { getMapKey, CentralLocation } from 'location'
import { getSessionLocation, getLastAttemptedDeliveryLocation } from 'session'

import { Location as LocationInterface } from 'types'

const mapKey = getMapKey()

type Props = {
  setLocation?: (location: LocationInterface) => void,
  mapCenter?: { lat: number, lon: number }
}

const markerStyle = {
  width: '30px',
  height: '30px'
}

const floatedMarkerStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%'
}

class Component extends React.Component<Props> {

  mapCenter = this.props.mapCenter ||
    getLastAttemptedDeliveryLocation() || getSessionLocation() || CentralLocation

  mapDefaults = {
    center: {
      lat: this.mapCenter.lat,
      lng: this.mapCenter.lon
    },
    zoom: 15
  }

  onChange = ({ center: { lat, lng }, zoom }: any) => {
    const { setLocation } = this.props
    setLocation && setLocation({ lat, lon: lng })
  }

  onDragEnd = ({ center: { lat, lng } }: any) => {
    const { setLocation } = this.props
    setLocation && setLocation({ lat: lat(), lon: lng() })
  }

  render() {
    const { mapCenter } = this.props
    return (<>
      <div style={{ height: '100%', width: '100%' }}>
        <Map
          bootstrapURLKeys={{ key: mapKey }}
          center={this.mapDefaults.center}
          zoom={this.mapDefaults.zoom}
          onDragEnd={this.onDragEnd}
          options={{
            zoomControl: false,
            fullscreenControl: false
          }}
        >
          {
            mapCenter ? <Marker lat={mapCenter.lat} lng={mapCenter.lon} /> : null
          }
        </Map>
      </div>{
        mapCenter
          ? null
          : <IonIcon
            className="ion-icon-primary"
            style={{ ...markerStyle, ...floatedMarkerStyle }}
            icon={locationIcon}
          />
      }
    </>)
  }

}

const Marker: React.FC<{ lat: number, lng: number }> = ({ lat, lng }) => (
  <IonIcon color="primary" icon={locationIcon} style={markerStyle} />
)

export default Component