import { login, logout, register } from '~/services/auth'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ILoginResponse } from '~/types/auth'
import { useDispatch } from 'react-redux'
import { topCenterToast } from '~/Toast/toast'
import { removeToken, setToken } from '~/utils/token'
import { setTokens } from '~/store/authSlice'
import { useNavigate } from 'react-router-dom'
import { socket } from '~/utils/socket'

export const useLogin = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const dispatch = useDispatch()

  const onSuccess = (res: ILoginResponse) => {
    dispatch(setTokens(res?.tokens))

    // Save data to local storage
    setToken(res?.tokens)

    // window.location.href= '/' // navigate to the home page
    navigate('/user/dashboard')
    queryClient.invalidateQueries({ queryKey: ['getMe'] })
    topCenterToast('success', 'Successfully Logged In')
    // queryClient.invalidateQueries("login");
  }
  const onError = (error: any) => {
    topCenterToast(
      'error',
      error?.response?.data?.message || error?.response?.message || error?.message || 'Something went wrong',
    )
  }

  const { mutateAsync, error, isError, isPending, isSuccess } = useMutation({
    mutationKey: ['login'],
    mutationFn: login,
    onSuccess,
    onError,
  })

  return { login: mutateAsync, error, isError, isLogginIn: isPending, isSuccess }
}

export const useSignup = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const onSuccess = (res: ILoginResponse) => {
    dispatch(setTokens(res?.tokens))

    // Save data to local storage
    setToken(res?.tokens)
    topCenterToast('success', 'Successfully Signed Up')

    navigate('/login')

    queryClient.invalidateQueries({ queryKey: ['getMe'] })
  }

  const onError = (error: any) => {
    topCenterToast(
      'error',
      error?.response?.data?.message || error?.response?.message || error?.message || 'Something went wrong',
    )
  }

  const { mutateAsync, error, isError, isPending, isSuccess } = useMutation({
    mutationKey: ['signup'],
    mutationFn: register,
    onSuccess,
    onError,
  })

  return { signup: mutateAsync, error, isError, isLoading: isPending, isSuccess }
}

export const useLogout = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const onSuccess = () => {
    dispatch(setTokens({}))
    socket.disconnect()
    localStorage.removeItem('token')
    queryClient.invalidateQueries({ queryKey: ['getMe'] })

    topCenterToast('success', 'Successfully Logged Out')
    removeToken()
    navigate('/login')
  }

  const onError = (error: any) => {
    navigate('/login')
    topCenterToast(
      'error',
      error?.response?.data?.message || error?.response?.message || error?.message || 'Something went wrong',
    )
  }

  const { mutateAsync, error, isError, isPending, isSuccess } = useMutation({
    mutationKey: ['logout'],
    mutationFn: logout,
    onSuccess,
    onError,
  })

  return { logout: mutateAsync, error, isError, isLoading: isPending, isSuccess }
}
