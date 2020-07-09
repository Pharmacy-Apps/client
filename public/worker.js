importScripts('https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.js')

let event = null

const url = location.host == 'localhost'
  ? 'https://pharmacy-demo-server.herokuapp.com'
  : (
    location.port == '3000'
      ? 'http://localhost:3015'
      : 'https://pharmacy-demo-server.herokuapp.com'
  )

const onSocketEvent = ({ action, result }) => {
  postMessage(result)
}

onmessage = function ({ data }) {

  console.info(
    (
      data.token ? 'Token' : 'Message'
    ) + ' received from main script',
    data.token ? '.. setting up socket' : ''
  )

  if (data.token) {
    const socket = io(url) // or self.io()
    socket.on(data.token, onSocketEvent)
    event = data.token
    return
  }

  if (event == null) return

  // Do other stuff here

}

// // Shared Worker Implementation

// onconnect = function ({ ports: [port] }) {

//   port.onmessage = function (e) {
//     const workerResult = e.data[0] * e.data[1]
//     port.postMessage(workerResult)
//     console.info('e')
//   }

// }