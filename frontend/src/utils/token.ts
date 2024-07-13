import { Tokens } from '~/types/auth'

export const getToken = (): any | null => {
  const item = localStorage.getItem('slark-token')
  return item ? JSON.parse(item) : null
}

export const setToken = (token: Tokens) => localStorage.setItem('slark-token', JSON.stringify(token))

export const removeToken = () => localStorage.removeItem('slark-token')
