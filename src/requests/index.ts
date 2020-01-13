import Axios from 'axios'

const baseURL = process.env.REACT_APP_BACKEND_URL
const instance = Axios.create({ baseURL })

instance.interceptors.response.use(function (response) {
  // Runs for status codes within 2**
  return response.data
}, function (error) {
  // Runs for status codes outside 2**
  // console.info('Response error', error)
  return Promise.reject(error.response.data)
})

export default instance

export const endPoints = {
  'login': '/user/login',
  'signup1': '/user/new',
  'signup2': '/user/register',
  'med-search': '/meds/search'
}