import { Geolocation } from '@ionic-native/geolocation'
import { setSessionLocation } from 'session'

export const updateCurrentPosition = () => {
  Geolocation.getCurrentPosition().then(res => {
    const { latitude: lat, longitude: lon, accuracy: acc } = res.coords
    setSessionLocation({ lat, lon, acc })
  }).catch(console.error)
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