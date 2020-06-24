import eventsInstance, { name as localEventName } from './events'
import { getSessionToken } from './session'

if (window.Worker) { // window.SharedWorker

  const worker = new Worker('worker.js')
  worker.postMessage({ token: getSessionToken() })

  worker.onmessage = function (e) {
    console.info('Message received from worker', e.data)
    eventsInstance.emit(localEventName, e.data)
  }

  // // Shared Worker Implementation

  // const worker = new SharedWorker('worker.js')
  // worker.port.onmessage = function (e) {
  //   console.info('Message received from worker', Date.now(), e.data)
  // }
  // worker.port.postMessage([4, 2])

}