import axios from 'axios'

var api = axios.create({
  baseURL: 'http://localhost:800/api',
  withCredentials: true,
})

export default api
