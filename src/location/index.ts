import { Geolocation } from '@ionic-native/geolocation'

import { setSessionLocation, getLastAttemptedDeliveryLocation, getSessionLocation } from 'session'
import { platformIsWeb } from 'utils'

export const updateCurrentPosition = async () => {
  const res = await Geolocation.getCurrentPosition()
  const { latitude: lat, longitude: lon, accuracy: acc } = res.coords
  const address = await queryAddress(lat, lon)
  const location = { lat, lon, acc, address }
  setSessionLocation(location)
  return location
}

export const watchPosition = () => {
  Geolocation.watchPosition().subscribe(async (res: any) => {
    try {
      const { latitude: lat, longitude: lon, accuracy: acc } = res.coords
      const address = await queryAddress(lat, lon)
      setSessionLocation({ lat, lon, acc, address })
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

export const getDeliveryAddressForNextOrder =
  (placeholder?: string) => getDeliveryLocationForNextOrder().address || placeholder

export const queryAddress = async (lat: number, lng: number) => {

  if (google === undefined) return null

  const geocoder: google.maps.Geocoder = new google.maps.Geocoder()

  const location = { lat, lng }

  return await new Promise(resolve => {
    geocoder.geocode({ location }, (results, status) => {
      console.debug('Geocoder query status', status, results)
      if (status !== 'OK') {
        resolve(null)
      } else if (results.length) {
        resolve(results[0].formatted_address)
      } else
        resolve(null)
    })
  })

}

export const queryPlace = async (map: google.maps.Map | undefined, query: string) => {

  if (query === null) return []
  if (query === '') return []
  if (map === undefined) return []

  return new Promise(resolve => {
    var request = {
      query, fields: ['name', 'geometry']
    }

    var service = new google.maps.places.PlacesService(map)

    service.findPlaceFromQuery(request, function (results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        resolve(results)
      } else
        resolve([])
    })
  })

}