const tokenKey = 'auth-token'
const phoneKey = 'phone'
const locationKey = 'location'

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
  return JSON.parse(
    localStorage.getItem(locationKey) || '{}'
  )
}

export const clearSession = () => {
  localStorage.clear()
}