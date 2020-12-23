import { isPlatform } from '@ionic/react'
import { ItemRequest as ItemRequestInterface } from 'types'

export const platformIsWeb = isPlatform('desktop')
export const platformIsMobile = isPlatform('mobile')
export const platformIsiOS = isPlatform('ios')
export const platformIsAndroid = isPlatform('android')

export const platformIsWebBrowser =
  window.location.host !== 'localhost' // window.location.host == localhost on mobile apps only

export const archivedRequestStates: Array<String> = ['cancelled', 'received']

export const getActiveRequests = (requests: Array<ItemRequestInterface>) => (
  requests.filter(({ state }) => archivedRequestStates.indexOf(state) < 0)
)

export const getArchivedRequests = (requests: Array<ItemRequestInterface>) => (
  requests.filter(({ state }) => archivedRequestStates.indexOf(state) > -1)
)

export const imageServerUrl = (
  window.location.host === 'localhost' // deployment on mobile
    ? process.env.REACT_APP_FILE_SERVER_URL_REMOTE
    : process.env.REACT_APP_FILE_SERVER_URL
) + '/images'

export const getAddress = (lat: number, lon: number, placeholder: string = 'Not known yet') => {
  return (
    lat && lon ? `${lat}, ${lon}` : placeholder
  )
}

export const requestStatesMappedToBadgeBackground: {
  [key: string]: string
} = {
  'awaiting transit': 'var(--ion-color-secondary)',
  'out of stock': 'var(--ion-color-out-of-stock)',
  'in transit': 'var(--ion-color-transit)',
  'cancelled': 'var(--ion-color-cancelled)',
  'delivered': 'var(--ion-color-primary)',
  'received': 'var(--ion-color-primary)'
}

export const APP_NAME = 'MediMall'

export const APP_VERSION = require('../../package.json').version
