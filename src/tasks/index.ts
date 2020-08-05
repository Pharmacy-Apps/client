import {
  Plugins,
  PushNotificationToken
} from '@capacitor/core'

import { platformIsMobile, platformIsAndroid } from 'utils'

import Requests, { endPoints } from 'requests'
import eventsInstance, { syncData } from '../events'

const { Network, PushNotifications } = Plugins

platformIsMobile && (function () {
  setPushNotificationListener()
  setNetworkListener()
})()

async function sendPushNotificationTokenToServer(token: string) {
  return await Requests.put(endPoints['push-notification-token'], {
    platform: platformIsAndroid ? 'android' : 'ios',
    token
  })
}

function setPushNotificationListener() {
  // Request permission to use push notifications
  // iOS prompts user and return if they granted permission or not
  // Android grants without prompting
  PushNotifications.requestPermissions && PushNotifications.requestPermissions().then(() => {

    PushNotifications.addListener('registration', (token: PushNotificationToken) => {
      sendPushNotificationTokenToServer(token.value)
    })

    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('Error on registration', JSON.stringify(error))
    })

    // Register with Apple / Google to receive push via APNS/FCM
    PushNotifications.register()

  }).catch(console.error)
}

function setNetworkListener() {
  Network.removeAllListeners()
  // Attempt to run callback once when the network listener fires multiple times
  let i = 0, previousConnectionType: any = null
  Network.addListener('networkStatusChange', ({ connected, connectionType }) => {
    if (previousConnectionType !== connectionType) i = 0
    if (connected) {
      i === 0 && eventsInstance.emit(syncData) // Trigger active page to sync data
      previousConnectionType = connectionType
      i++
    } else {
      i = 0
    }
  })
}
