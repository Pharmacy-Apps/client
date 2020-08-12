import { isPlatform } from '@ionic/react'
import { ItemRequest as ItemRequestInterface } from 'types'

export const platformIsWeb = isPlatform('desktop')
export const platformIsMobile = isPlatform('mobile')
export const platformIsiOS = isPlatform('ios')
export const platformIsAndroid = isPlatform('android')

export const archivedRequestStates: Array<String> = ['cancelled', 'received']

export const getActiveRequests = (requests: Array<ItemRequestInterface>) => (
  requests.filter(({ state }) => archivedRequestStates.indexOf(state) < 0)
)

export const getArchivedRequests = (requests: Array<ItemRequestInterface>) => (
  requests.filter(({ state }) => archivedRequestStates.indexOf(state) > -1)
)