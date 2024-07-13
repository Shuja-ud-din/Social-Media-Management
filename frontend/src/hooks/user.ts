import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMe, UserscheduleTime } from '~/services/user'
import { topCenterToast } from '~/Toast/toast'
import { IUser } from '~/types/auth'

export const useGetMe = () => {
  const { data, error, isError, isPending, isSuccess, isFetching } = useQuery({
    queryKey: ['getMe'],
    queryFn: getMe,
    staleTime: 60 * 60 * 1000, // 1 hour
  })

  return { user: data, error, isError, isLoading: isPending, isSuccess, isFetching }
}

export const useUserscheduleTime = () => {
  const queryClient = useQueryClient()

  const onSuccess = (res: IUser) => {
    // Save data to local storage
    topCenterToast('success', 'Successfully Updated Schedule Time')
    queryClient.invalidateQueries({ queryKey: ['getMe'] })
  }

  const onError = (error: any) => {
    topCenterToast(
      'error',
      error?.response?.data?.message || error?.response?.message || error?.message || 'Something went wrong',
    )
  }

  const { mutateAsync, error, isError, isPending, isSuccess } = useMutation({
    mutationKey: ['updateScheduleTime'],
    mutationFn: UserscheduleTime,
    onSuccess,
    onError,
  })

  return { updateUserScheduleTime: mutateAsync, error, isError, isLoading: isPending, isSuccess }
}
