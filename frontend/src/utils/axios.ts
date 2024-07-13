import axios, { AxiosResponse } from 'axios'
import env from '~/config/env'
import { setTokens, clearAuthData } from '~/store/authSlice'
import store from '~/store/store'
import { SignUPResponse } from '~/types/api'
import { getToken } from '~/utils/token'

const instance = axios.create({
  baseURL: env.REACT_APP_API_URL,
})

// Intercept requests to attach JWT token
instance.interceptors.request.use(
  (config) => {
    const { token } = getToken().access
    if (token) {
      config.headers.Authorization = `bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config

    // Check if the error is due to an expired access token
    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // Use the refresh token to obtain a new access token
      const { token } = getToken().refresh

      if (!token) return Promise.reject('No Token Found')

      return instance
        .post('/auth/refresh-tokens', {
          refreshToken: token,
        })
        .then((response: AxiosResponse<SignUPResponse>) => {
          // Update the access token in the Redux store and local storage
          store.dispatch(setTokens(response.data.tokens))
          localStorage.setItem('tokens', JSON.stringify(response.data.tokens))

          // Retry the original request with the new access token
          originalRequest.headers['Authorization'] = `Bearer ${response.data.tokens.access.token}`
          return instance(originalRequest)
        })
        .catch((refreshError) => {
          // Handle refresh token error (e.g., logout the user)
          // You can also redirect to the login page or display a message
          console.error('Token refresh failed:', refreshError)

          // Clear user data from Redux store and local storage
          store.dispatch(clearAuthData())
          localStorage.clear()

          // Redirect to the login page or display an error message
          // Example: navigate('/login');
          return Promise.reject(refreshError)
        })
    }

    return Promise.reject(error)
  },
)

export default instance
