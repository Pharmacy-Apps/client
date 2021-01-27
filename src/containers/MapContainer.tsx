import React from 'react'

import { IonIcon } from '@ionic/react'
import { locationSharp as locationIcon } from 'ionicons/icons'

import { CentralLocation } from 'location'
import { getSessionLocation, getLastAttemptedDeliveryLocation } from 'session'

import { Location as LocationInterface } from 'types'

type Props = {
  setLocation?: (location: LocationInterface) => void,
  mapCenter?: { lat: number, lon: number },
  onMapApiLoaded?: (a1: google.maps.Map) => void
}

const markerStyle = {
  width: '30px',
  height: '30px',
  position: 'absolute',
  top: 'calc(50% - 15px)',
  left: 'calc(50% - 15px)'
}

class Component extends React.Component<Props> {

  mapCenter = this.props.mapCenter ||
    getLastAttemptedDeliveryLocation() || getSessionLocation() || CentralLocation

  mapDefaults = {
    center: {
      lat: this.mapCenter.lat,
      lng: this.mapCenter.lon
    },
    zoom: 12
  }

  onChange = ({ lat, lon }: any) => {
    const { setLocation } = this.props
    setLocation && setLocation({ lat, lon })
  }

  componentDidMount() {
    if (window.google) {
      const { onMapApiLoaded, mapCenter } = this.props
      const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: this.mapDefaults.center,
        zoom: this.mapDefaults.zoom,
        zoomControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        draggable: Boolean(mapCenter) === false
      })
      map.addListener('center_changed', () => {
        const { lat, lng } = map.getCenter()
        this.onChange({ lat: lat(), lon: lng() })
      })
      onMapApiLoaded && onMapApiLoaded(map)
    }
  }

  render() {
    return window.google ? (<>
      <div id="map" style={{ height: '100%', width: '100%' }} />
      {
        <IonIcon
          className="ion-icon-secondary"
          style={markerStyle}
          icon={locationIcon}
        />
      }
    </>) : null
  }

}

// const Marker: React.FC<{ lat: number, lng: number }> = ({ lat, lng }) => (
//   <IonIcon className="ion-icon-secondary" icon={locationIcon} style={markerStyle} />
// )

export default Component