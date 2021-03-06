import Axios from 'axios'
import { sessionAvailable, getSessionToken } from 'session'

const baseURL = window.location.host === 'localhost' // deployment on mobile
  ? process.env.REACT_APP_BACKEND_URL_REMOTE
  : process.env.REACT_APP_BACKEND_URL

const defaultHeaders = {
  'Response-Language': 'en'
}

const headers = sessionAvailable() ? {
  ...defaultHeaders,
  'Authorization': `Bearer ${getSessionToken()}`
} : defaultHeaders

const instance = Axios.create({ baseURL, headers })

const NETWORK_ERROR = 'Please check that you have an active internet connection'

instance.interceptors.response.use(function (response) {
  // Runs for status codes within 2**
  return response.data
}, function (error) {
  // Runs for status codes outside 2**
  return Promise.reject(error.response ? error.response.data : NETWORK_ERROR)
})

export default instance

export const endPoints = {
  'login': '/user/login',
  'signup1': '/user/new',
  'signup2': '/user/register',
  'item-search': '/items/search',
  'item-requests': '/item-request',
  'credits': '/credits',
  'credit-offers': '/credits/offers',
  'mtn-msisdn': '/user/mtn-msisdn',
  'couriers': '/courier',
  'push-notification-token': '/push-notification-token'
}