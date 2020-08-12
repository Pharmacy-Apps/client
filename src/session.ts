const tokenKey = 'auth-token'
const phoneKey = 'phone'
const locationKey = 'location'
const deliveryLocationKey = 'delivery-location'

export const getSessionToken = () => {
  return localStorage.getItem(tokenKey)
}

export const sessionAvailable = () => Boolean(getSessionToken())

export const setSessionToken = (token: string) => {
  localStorage.setItem(tokenKey, token)
}

export const getSessionPhone = () => {
  return localStorage.getItem(phoneKey)
}

export const setSessionPhone = (phone: string) => {
  localStorage.setItem(phoneKey, phone)
}

export const setSessionLocation = (location: Object) => {
  localStorage.setItem(
    locationKey,
    JSON.stringify(location)
  )
}

export const getSessionLocation = () => {
  const location = localStorage.getItem(locationKey)
  return location ? JSON.parse(location) : null
  // return JSON.parse(
  //   localStorage.getItem(locationKey) || '{}'
  // )
}

export const setDeliveryLocation = (location: Object) => {
  localStorage.setItem(
    deliveryLocationKey,
    JSON.stringify(location)
  )
}

export const getLastAttemptedDeliveryLocation = () => {
  const location = localStorage.getItem(deliveryLocationKey)
  return location ? JSON.parse(location) : null
}

export const clearSession = () => {
  localStorage.clear()
}