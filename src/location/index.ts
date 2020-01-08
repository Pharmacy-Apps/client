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
    const { latitude: lat, longitude: lon, accuracy: acc } = res.coords
    setSessionLocation({ lat, lon, acc })
  }, console.error)
}