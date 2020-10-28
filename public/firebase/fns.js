function platformIsWeb() {
  return location.host != 'localhost' // Re-think this
}

function platformIsLocal() {
  return location.host == 'localhost:3000' // Re-think this
}

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

async function retrieveFCMToken(fcm) {
  let token = null
  try {
    token = await fcm.getToken()
  } catch (error) {
    console.error(error)
  }
  return token
}

async function sendFCMTokenToServer(token) {
  const {
    'local-server-url': localUrl,
    'remote-server-url': remoteUrl,
    'server-auth-token-key': key,
    'push-notification-token-send-state-key': pushNotificationTokenSendStateKey
  } = await readJSONFile('/firebase/vars.json')

  const url = platformIsLocal() ? localUrl : remoteUrl
  const sessionAvailable = localStorage.getItem(key) != undefined
  const pushNotificationTokenNotSent = localStorage.getItem(pushNotificationTokenSendStateKey) == undefined ||
    localStorage.getItem(pushNotificationTokenSendStateKey) == '0'

  let result = null
  if (sessionAvailable && pushNotificationTokenNotSent) {
    const { data } = await axios({
      url: url + '/push-notification-token',
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem(key),
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({ platform: 'web', token })
    })
    result = data.result
    localStorage.setItem(pushNotificationTokenSendStateKey, '1')
  }

  return result
}