/**
 * Run script only on Web, mobile platforms use PushNotifications plugin
 * 
 */

if (platformIsWeb()) (async function () {

  try {

    const fcm = await initializeFCM()
    const token = await retrieveFCMToken(fcm)
    await sendFCMTokenToServer(token)

    fcm.onTokenRefresh(async () => {
      const {
        'push-notification-token-send-state-key': pushNotificationTokenSendStateKey
      } = await readJSONFile('/firebase/vars.json')

      const token = await retrieveFCMToken(fcm)
      
      localStorage.setItem(pushNotificationTokenSendStateKey, '0')
      await sendFCMTokenToServer(token)
    })

  } catch (error) {
    console.error(error)
  }

})()
