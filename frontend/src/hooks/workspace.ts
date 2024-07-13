import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { topCenterToast } from '~/Toast/toast'
import {
  getWorkspaces,
  createWorkspace,
  uploadImage,
  getWorkspaceBySlug,
  updateWorkspace,
  deleteWorkspace,
  generateYoutubeURL,
  generateTitleAndDescription,
  uploadVideoToYoutube,
  refreshYoutubeToken,
  getTwitterOAuth,
  uploadVideoToTwitter,
  refreshTwitterToken,
  getInstagramOAuth,
} from '~/services/workspace'

export const useGetWorkspace = () => {
  const { data, error, isError, isPending, isSuccess, isFetching } = useQuery({
    queryKey: ['getWorkspace'],
    queryFn: getWorkspaces,
  })

  return { workspaces: data, error, isError, isLoading: isPending, isSuccess, isFetching }
}

export const useCreateWorkspace = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['getWorkspace', 'getWorkspaceDetails'] })

    topCenterToast('success', 'Workspace Successfully Added')

    navigate('/user/workspaces')
  }

  const onError = (error: any) => {
    topCenterToast(
      'error',
      error?.response?.data?.message ||
        error?.response?.message ||
        error?.message ||
        'Workspace registration failed. Please try again later.',
    )
  }

  const { mutateAsync, error, isError, isPending, isSuccess } = useMutation({
    mutationKey: ['createWorkspace'],
    mutationFn: createWorkspace,
    onSuccess,
    onError,
  })

  return { createWorkspace: mutateAsync, error, isError, isLoading: isPending, isSuccess }
}

export const useUploadImage = () => {
  const onSuccess = () => {
    topCenterToast('success', 'Image Successfully Uploaded')
  }

  const onError = (error: any) => {
    topCenterToast(
      'error',
      error?.response?.data?.message ||
        error?.response?.message ||
        error?.message ||
        'Image upload failed. Please try again later.',
    )
  }

  const { mutateAsync, error, isError, isPending, isSuccess } = useMutation({
    mutationKey: ['uploadImage'],
    mutationFn: uploadImage,
    onSuccess,
    onError,
  })

  return { uploadImage: mutateAsync, error, isError, isLoading: isPending, isSuccess }
}

export const useGetWorkspaceDetails = (slug?: string) => {
  const { data, error, isError, isPending, isSuccess, isFetching, refetch } = useQuery({
    queryKey: ['getWorkspaceDetails', slug],
    queryFn: getWorkspaceBySlug,
    staleTime: 30 * 60 * 1000, // 1 hour
    enabled: !!slug,
  })

  return { workspace: data, error, isError, isLoading: isPending, isSuccess, isFetching, refetch }
}

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient()

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['getWorkspace'] })

    topCenterToast('success', 'Workspace Successfully Updated')
  }

  const onError = (error: any) => {
    topCenterToast(
      'error',
      error?.response?.data?.message ||
        error?.response?.message ||
        error?.message ||
        'Workspace update failed. Please try again later.',
    )
  }

  const { mutateAsync, error, isError, isPending, isSuccess } = useMutation({
    mutationKey: ['updateWorkspace'],
    mutationFn: updateWorkspace,
    onSuccess,
    onError,
  })

  return { updateWorkspace: mutateAsync, error, isError, isLoading: isPending, isSuccess }
}

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient()

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['getWorkspace'] })

    topCenterToast('success', 'Workspace Successfully Deleted')
  }

  const onError = (error: any) => {
    topCenterToast(
      'error',
      error?.response?.data?.message ||
        error?.response?.message ||
        error?.message ||
        'Workspace deletion failed. Please try again later.',
    )
  }

  const { mutateAsync, error, isError, isPending, isSuccess } = useMutation({
    mutationKey: ['deleteWorkspace'],
    mutationFn: deleteWorkspace,
    onSuccess,
    onError,
  })

  return { deleteWorkspace: mutateAsync, error, isError, isLoading: isPending, isSuccess }
}

export const useGetYoutubeAuthURL = () => {
  const queryClient = useQueryClient()

  const onSuccess = (url: any) => {
    queryClient.invalidateQueries({ queryKey: ['getWorkspaceDetails'] })
    if (url) window.location.href = url
  }

  const onError = (error: any) => {
    topCenterToast(
      'error',
      error?.response?.data?.message ||
        error?.response?.message ||
        error?.message ||
        'YouTube token generation failed. Please try again later.',
    )
  }

  const { mutateAsync, error, isError, isPending, isSuccess } = useMutation({
    mutationKey: ['generateYoutubeURL'],
    mutationFn: generateYoutubeURL,
    onSuccess,
    onError,
  })

  return { generateYoutubeURL: mutateAsync, error, isError, isLoading: isPending, isSuccess }
}

export const useGenerateTitleDescription = () => {
  const onError = (error: any) => {
    topCenterToast('error', 'Something went wrong. Please try again.')
  }

  const { mutateAsync, error, isError, isPending, isSuccess, data } = useMutation({
    mutationKey: ['generateTitleAndDescription'],
    mutationFn: generateTitleAndDescription,
  })

  return { generateTitleDescription: mutateAsync, data, error, isError, isLoading: isPending, isSuccess }
}

export const useUploadVideoToYouTube = () => {
  const queryClient = useQueryClient()

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['getWorkspace'] })

    topCenterToast('success', 'Video Successfully Uploaded to YouTube')
  }

  const onError = (error: any) => {
    topCenterToast(
      'error',
      error?.response?.data?.message ||
        error?.response?.message ||
        error?.message ||
        'Video upload failed. Please try again later.',
    )
  }

  const { mutateAsync, error, isError, isPending, isSuccess } = useMutation({
    mutationKey: ['uploadVideoToYouTube'],
    mutationFn: uploadVideoToYoutube,
    onSuccess,
    onError,
  })

  return { uploadVideoToYouTube: mutateAsync, error, isError, isLoading: isPending, isSuccess }
}

export const useRefreshYoutubeToken = () => {
  const queryClient = useQueryClient()

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['getWorkspaceDetails'] })

    topCenterToast('success', 'YouTube Token Successfully Refreshed')
  }

  const onError = (error: any) => {
    topCenterToast(
      'error',
      error?.response?.data?.message ||
        error?.response?.message ||
        error?.message ||
        'YouTube token refresh failed. Please try again later.',
    )
  }

  const { mutateAsync, error, isError, isPending, isSuccess } = useMutation({
    mutationKey: ['refreshYoutubeToken'],
    mutationFn: refreshYoutubeToken,
    onSuccess,
    onError,
  })

  return { refreshYoutubeToken: mutateAsync, error, isError, isLoading: isPending, isSuccess }
}

export const useGetTwitterOAuth = () => {
  const queryClient = useQueryClient()

  const onSuccess = (data: any) => {
    queryClient.invalidateQueries({ queryKey: ['getWorkspaceDetails'] })
    console.log(data)
  }

  const onError = (error: any) => {
    topCenterToast(
      'error',
      error?.response?.data?.message ||
        error?.response?.message ||
        error?.message ||
        'Twitter token generation failed. Please try again later.',
    )
  }

  const { mutateAsync, error, isError, isPending, isSuccess } = useMutation({
    mutationKey: ['getTwitterOAuth'],
    mutationFn: getTwitterOAuth,
    onSuccess,
    onError,
  })

  return { getTwitterOAuth: mutateAsync, error, isError, isLoading: isPending, isSuccess }
}

export const useUploadVideoToTwitter = () => {
  const queryClient = useQueryClient()

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['getWorkspace'] })

    topCenterToast('success', 'Video Successfully Uploaded to Twitter')
  }

  const onError = (error: any) => {
    topCenterToast(
      'error',
      error?.response?.data?.message ||
        error?.response?.message ||
        error?.message ||
        'Video upload failed. Please try again later.',
    )
  }

  const { mutateAsync, error, isError, isPending, isSuccess } = useMutation({
    mutationKey: ['uploadVideoToTwitter'],
    mutationFn: uploadVideoToTwitter,
    onSuccess,
    onError,
  })

  return { uploadVideoToTwitter: mutateAsync, error, isError, isLoading: isPending, isSuccess }
}

export const useRefreshTwitterToken = () => {
  const queryClient = useQueryClient()

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['getWorkspaceDetails'] })

    topCenterToast('success', 'Twitter Token Successfully Refreshed')
  }

  const onError = (error: any) => {
    topCenterToast('error', 'Twitter token refresh failed. ')
  }

  const { mutateAsync, error, isError, isPending, isSuccess } = useMutation({
    mutationKey: ['refreshTwitterToken'],
    mutationFn: refreshTwitterToken,
    onSuccess,
    onError,
  })

  return { refreshTwitterToken: mutateAsync, error, isError, isLoading: isPending, isSuccess }
}

export const useGetInstagramOAuth = () => {
  const queryClient = useQueryClient()

  const onSuccess = (url: any) => {
    queryClient.invalidateQueries({ queryKey: ['getWorkspaceDetails'] })
    if (url) window.location.href = url
  }

  const onError = (error: any) => {
    topCenterToast(
      'error',
      error?.response?.data?.message ||
        error?.response?.message ||
        error?.message ||
        'Instagram Auth generation failed. Please try again later.',
    )
  }

  const { mutateAsync, error, isError, isPending, isSuccess } = useMutation({
    mutationKey: ['getInstagramOAuth'],
    mutationFn: getInstagramOAuth,
    onSuccess,
    onError,
  })

  return { getInstagramOAuth: mutateAsync, error, isError, isLoading: isPending, isSuccess }
}
