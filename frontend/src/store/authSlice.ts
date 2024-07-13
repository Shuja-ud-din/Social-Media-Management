import { createSlice } from '@reduxjs/toolkit'
import { Tokens, User } from '~/types/api'

interface AuthState {
  user: User | null
  tokens: Tokens | null
}

const initialState: AuthState = {
  user: null,
  tokens: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    },
    setTokens: (state, action) => {
      state.tokens = action.payload
    },
    clearAuthData: (state) => {
      state.user = null
      state.tokens = null
    },
  },
})

export const { setUser, setTokens, clearAuthData } = authSlice.actions
export default authSlice.reducer
