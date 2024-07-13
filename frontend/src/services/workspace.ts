import {
  ICreateWorkspace,
  IDeleteWorkspace,
  IGetAllWorkspaces,
  IUploadImage,
  OpenAIResponse,
  RefreshTokenResponse,
  TwitterVideoInfo,
  WorkspaceInfo,
  YoutubeVideoInfo,
} from '~/types/workspace'
import instance from '~/utils/axios'

export const getWorkspaces = async (): Promise<IGetAllWorkspaces> => {
  const { data } = await instance.get('/workspace')
  return data
}

export const createWorkspace = async (workspace: WorkspaceInfo): Promise<ICreateWorkspace | null> => {
  const { data } = await instance.post('/workspace', workspace)
  return data
}

export const uploadImage = async (image: File): Promise<IUploadImage | null> => {
  const { data } = await instance.post(
    '/upload/image',
    {
      image,
    },
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )
  return data
}

export const getWorkspaceBySlug = async ({ queryKey }: any): Promise<WorkspaceInfo | null> => {
  const [, slug] = queryKey
  const { data } = await instance.get(`/workspace/${slug}`)
  return data.data
}

export const updateWorkspace = async (workspace: WorkspaceInfo) => {
  const { data } = await instance.put(`/workspace/${workspace._id}`, {
    name: workspace.name,
    description: workspace.description,
    logo: workspace.logo,
    scheduleTime: workspace.scheduleTime,
    status: workspace.status,
  })
  return data
}

export const deleteWorkspace = async (id: string): Promise<IDeleteWorkspace> => {
  const { data } = await instance.delete(`/workspace/${id}`)
  return data
}

export const generateYoutubeURL = async (workspaceId: string): Promise<string | null> => {
  const { data } = await instance.get(`/workspace/youtube/createUrl`, {
    params: {
      workspaceId,
    },
  })

  return data
}

export const generateTitleAndDescription = async (prompt: string): Promise<OpenAIResponse> => {
  const { data } = await instance.post('/chatgpt/generateTitleAndDescription', {
    prompt,
  })

  return data
}

export const uploadVideoToYoutube = async (videoInfo: YoutubeVideoInfo): Promise<any> => {
  const { data } = await instance.post('/workspace/youtube/uploadVideo', videoInfo, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return data
}

export const refreshYoutubeToken = async (workspaceId: string): Promise<RefreshTokenResponse> => {
  const { data } = await instance.get(`/workspace/youtube/refreshToken/${workspaceId}`)
  return data
}

export const getTwitterOAuth = async (workspaceId: string): Promise<string | null> => {
  const { data } = await instance.get(`/workspace/twitter/auth/${workspaceId}`)

  return data
}

export const uploadVideoToTwitter = async (videoInfo: TwitterVideoInfo): Promise<any> => {
  const { data } = await instance.post('/workspace/twitter/uploadVideo', videoInfo, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  console.log(data)

  return data
}

export const refreshTwitterToken = async (workspaceId: string): Promise<RefreshTokenResponse> => {
  const { data } = await instance.get(`/workspace/twitter/refreshToken/${workspaceId}`)
  return data
}

export const getInstagramOAuth = async (workspaceId: string): Promise<string | any> => {
  const { data } = await instance.get(`/workspace/instagram/auth/${workspaceId}`)

  return data
}
