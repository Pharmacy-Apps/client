import eventsInstance from './events'
import decrypt from './utils/jwt'

import { getSessionToken } from './session'

// Use window.SharedWorker

if (window.Worker) try {

  const worker = new Worker('worker.js')
  const { id } = decrypt(getSessionToken())

  worker.postMessage({ token: id })

  worker.onmessage = function (e) {
    const { action, result } = e.data
    eventsInstance.emit(action, result)
  }

} catch (error) {
  console.error('Worker script failed', error)
} else {
  console.error('Worker not supported')
}