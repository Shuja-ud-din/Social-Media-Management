import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { topCenterToast } from '~/Toast/toast'
import { createReel, deleteReel, getReels, processReel } from '~/services/reel'
import { IReelCreated, IReelListProps } from '~/types/reel'

export const useGetReels = ({ page, limit }: IReelListProps) => {
  const { data, error, isError, isPending, isSuccess, isFetching, isPlaceholderData } = useQuery({
    queryKey: ['getReels', page, limit],
    queryFn: getReels,
    staleTime: 30 * 60 * 1000, // 1 hour
    placeholderData: keepPreviousData,
  })

  return { data, error, isError, isLoading: isPending, isSuccess, isFetching, isPlaceholderData }
}

export const useCreateReel = () => {
  const queryClient = useQueryClient()

  const onSuccess = (res: IReelCreated) => {
    queryClient.invalidateQueries({ queryKey: ['getReels'] })

    topCenterToast('success', 'Successfully Reel Added')
  }

  const onError = (error: any) => {
    topCenterToast(
      'error',
      error?.response?.data?.message ||
        error?.response?.message ||
        error?.message ||
        'Reel registration failed. Please try again later.',
    )
  }

  const { mutateAsync, error, isError, isPending, isSuccess } = useMutation({
    mutationKey: ['createReel'],
    mutationFn: createReel,
    onSuccess,
    onError,
  })

  return { createReels: mutateAsync, error, isError, isLoading: isPending, isSuccess }
}

export const useDeleteReel = () => {
  const queryClient = useQueryClient()

  const onSuccess = (res: string) => {
    queryClient.invalidateQueries({ queryKey: ['getReels'] })

    topCenterToast('success', 'Reel deleted successfully')
  }

  const onError = (error: any) => {
    topCenterToast(
      'error',
      error?.response?.data?.message ||
        error?.response?.message ||
        error?.message ||
        'Unable to delete Reel. Please try again later.',
    )
  }

  const { mutateAsync, error, isError, isPending, isSuccess } = useMutation({
    mutationKey: ['deleteReel'],
    mutationFn: deleteReel,
    onSuccess,
    onError,
  })

  return { deleteReel: mutateAsync, error, isError, isLoading: isPending, isSuccess }
}

export const useProcessReel = (id: string) => {
  const { data, error, isError, isPending, isSuccess, isFetching } = useQuery({
    queryKey: ['processReel', id],
    queryFn: processReel,
    staleTime: 30 * 60 * 1000, // 1 hour
    enabled: !!id,
  })

  return { data, error, isError, isLoading: isPending, isSuccess, isFetching }
}
