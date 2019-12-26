const tokenKey = 'auth-token'

export const getSessionToken = () => {
  return localStorage.getItem(tokenKey)
}

export const sessionAvailable = () => Boolean(getSessionToken())

export const setSessionToken = (token: string) => {
  localStorage.setItem(tokenKey, token)
}

export const clearSession = () => {
  localStorage.removeItem(tokenKey)
}