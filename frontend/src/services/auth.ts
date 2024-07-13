import { apis } from '~/constants/apis'
import { TLoginService, TSignupService } from '~/types/auth'
import axios from 'axios'
import env from '~/config/env'
import { getToken } from '~/utils/token'

const instance = axios.create({
  baseURL: env.REACT_APP_API_URL,
})

export const login: TLoginService = async (user) => {
  const { data } = await instance.post(apis.login, user)
  return data
}

export const register: TSignupService = async (user) => {
  const { data } = await instance.post(apis.signup, user)
  return data
}

export const logout = async (): Promise<void> => {
  return await instance.post(apis.logout, {
    refreshToken: getToken().refresh.token,
  })
}
