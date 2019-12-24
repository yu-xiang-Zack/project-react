import createFetcher from './create-fetcher'
import history from './history'
import api from './api'

const userInfoFetcher = createFetcher(async() => {
  return api.get('/userinfo').catch(() => {
    history.push('./')
  })
})

export default userInfoFetcher