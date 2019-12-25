import axios from 'axios'

var api = axios.create({
  baseURL: '/api',
  // withCredentials: true,
})

export default api
