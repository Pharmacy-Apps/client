import {
  Plugins,
  PushNotificationToken
} from '@capacitor/core'

import { platformIsMobile, platformIsAndroid } from 'utils'

import Routes from 'routes'
import Requests, { endPoints } from 'requests'
import { getActiveRequestsPresence } from 'session'
import eventsInstance, { syncData } from '../events'

const { App, Network, PushNotifications } = Plugins

platformIsMobile && (function () {
  setPushNotificationListener()
  setNetworkListener()
  setBackButtonListener()
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

const deadPaths = [
  Routes.login.path,
  Routes.home.path
]

function setBackButtonListener() {
  document.addEventListener('ionBackButton', (ev: any) => {
    ev.detail.register(-1, () => {
      const path = window.location.pathname
      if (path === Routes.requests.path) {
        const activeRequestsPresent = getActiveRequestsPresence()
        if (activeRequestsPresent) {
          App.exitApp()
        } else {
          window.location.href = Routes.home.path
        }
      } else if (deadPaths.includes(path))
        App.exitApp()
    })
  })
}
