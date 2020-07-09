import eventsInstance, { name as localEventName } from './events'
import decrypt from './libs/jwt'
import { getSessionToken } from './session'

if (window.Worker) { // window.SharedWorker

  try {

    const worker = new Worker('worker.js')
    const { id } = decrypt(getSessionToken())

    worker.postMessage({ token: id })

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

  } catch (error) {
    console.error('Worker script failed', error)
  }

} else console.error('Worker not supported')