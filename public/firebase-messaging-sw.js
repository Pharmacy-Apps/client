importScripts('https://www.gstatic.com/firebasejs/7.15.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/7.15.0/firebase-messaging.js')

async function readJSONFile(filePath) {
  const response = await fetch(filePath)
  return JSON.parse(await response.text())
}

async function initializeFCM() {

  const {
    'fb-configuration': configuration,
    'fcm-vapid-key': vapidKey
  } = await readJSONFile('/firebase/vars.json')

  firebase.initializeApp(configuration)

  const messaging = firebase.messaging()
  messaging.usePublicVapidKey(vapidKey)

  return messaging

}

(async function () { await initializeFCM() })()
