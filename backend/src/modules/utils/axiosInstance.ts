import axios, { AxiosResponse } from 'axios'
import mongoose from 'mongoose'
import User from '../user/user.model'
import Config from '../../config/config'
// eslint-disable-next-line import/no-cycle

const axiosApiInstance = axios.create()

axiosApiInstance.interceptors.request.use(
  async (originalConfig) => {
    // const clientid = originalConfig.headers['client-id']
    const { clientid } = originalConfig.params
    // eslint-disable-next-line no-console
    console.log('clientid: request ', clientid)
    // const state = new mongoose.Types.ObjectId(clientid as string)
    const token = await User.findById(clientid).select('youtube_access_token')
    // .then((user) => user?.youtube_access_token)
    // eslint-disable-next-line no-console
    console.log('db token: request ', token)
    const config = { ...originalConfig }
    // eslint-disable-next-line no-console
    console.log('config: ', config.headers.Authorization)
    config.headers.Authorization = `bearer ${token}`
    config.headers.Accept = 'application/json'
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    return config
  },
  (error) => {
    Promise.reject(error)
  },
)

axiosApiInstance.interceptors.response.use(
  (Response) => Response,
  async (error) => {
    const originalRequest = error.config
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const clientid = originalRequest.headers['client-id']
      const state = new mongoose.Types.ObjectId(clientid as string)

      // eslint-disable-next-line no-console
      // console.log('clientid: ', clientid)
      // eslint-disable-next-line no-console
      // console.log('state: ', state)
      const user = await User.findById(state)

      // eslint-disable-next-line no-console
      // console.log('db user: ', user)

      // eslint-disable-next-line prefer-promise-reject-errors
      if (!user) return Promise.reject('No Token Found')
      return axiosApiInstance
        .post('https://oauth2.googleapis.com/token', {
          client_id: Config.google.client_id,
          client_secret: Config.google.client_secret,
          grant_type: 'refresh_token',
          // refresh_token: user.youtube_refresh_token,
        })
        .then(async (response: AxiosResponse) => {
          // Update the access token in the database
          await User.findByIdAndUpdate(
            state,
            {
              youtube_access_token: response.data.tokens.access.token,
            },
            { new: true },
          )
          // Retry the original request with the new access token
          originalRequest.headers.Authorization = `Bearer ${response.data.tokens.access.token}`
          return axiosApiInstance(originalRequest)
        })
        .catch((refreshError) => {
          // Handle refresh token error (e.g., logout the user)
          // You can also redirect to the login page or display a message
          // eslint-disable-next-line no-console
          console.error('Token refresh failed:', refreshError)

          return Promise.reject(refreshError)
        })
    }
    return Promise.reject(error)
  },
)

export default axiosApiInstance
