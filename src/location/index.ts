import { Geolocation } from '@ionic-native/geolocation'
import { setSessionLocation, getLastAttemptedDeliveryLocation, getSessionLocation } from 'session'
import { platformIsWeb } from 'utils'

export const updateCurrentPosition = async () => {
  const res = await Geolocation.getCurrentPosition()
  const { latitude: lat, longitude: lon, accuracy: acc } = res.coords
  const location = { lat, lon, acc }
  setSessionLocation(location)
  return location
}

export const watchPosition = () => {
  Geolocation.watchPosition().subscribe((res: any) => {
    try {
      const { latitude: lat, longitude: lon, accuracy: acc } = res.coords
      setSessionLocation({ lat, lon, acc })
    } catch (e) { }
  }, console.error)
}

export const formatDistance = (mDistance: number) => { // mDistance - meter distance
  if (mDistance < 50) return '< 50m'
  if (mDistance < 1000) return `${mDistance}m`
  if (mDistance < 50000) return `${mDistance / 1000}km`
  return '> 50km'
}

export const getMapKey: () => string = () => (
  platformIsWeb ? process.env.REACT_APP_MAP_KEY_WEB : process.env.REACT_APP_MAP_KEY_MOBILE
) || ''

export const CentralLocation = {
  lat: 0.3476, lon: 32.5825
}

export const getDeliveryLocationForNextOrder = () => (
  getLastAttemptedDeliveryLocation() || getSessionLocation() || {}
)
