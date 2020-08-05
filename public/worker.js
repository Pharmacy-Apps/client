importScripts('https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.js')

let event = null

const url = location.host == 'localhost'
  ? 'https://pharmacy-demo-server.herokuapp.com'
  : (
    location.port == '3000'
      ? 'http://localhost:3015'
      : 'https://pharmacy-demo-server.herokuapp.com'
  )

const onSocketEvent = message => {
  console.info('Message received from server', message)
  postMessage(message)
}

onmessage = function ({ data }) {

  console.info(
    (
      data.token ? 'Session token' : 'Message'
    ) + ' received from main script',
    data.token ? '.. setting up socket io' : ''
  )

  if (data.token) {
    const socket = io(url, { query: `token=${data.token}` })
    socket.on(data.token, onSocketEvent)
    event = data.token
    return
  }

  if (event == null) return

  // Do other stuff here

}
