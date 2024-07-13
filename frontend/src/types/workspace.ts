interface ISocailMediaToken {
  accessToken: string
  refreshToken: string
  expiryDate: number
  loggedIn: boolean
}

export interface WorkspaceInfo {
  _id?: string
  name: string
  description: string
  logo: string
  scheduleTime: number
  Youtube?: ISocailMediaToken
  tiktok?: ISocailMediaToken
  instagram?: ISocailMediaToken
  facebook?: ISocailMediaToken
  twitter?: ISocailMediaToken
  status: string
  slug?: string
}

export interface ICreateWorkspace {
  message: string
  success: boolean
  data: WorkspaceInfo
}

export interface IUploadImage {
  message: string
  url: string
}

export interface IDeleteWorkspace {
  success: boolean
  message: string
}

export interface IGetAllWorkspaces {
  success: boolean
  data: WorkspaceInfo[]
}

export interface OpenAIResponse {
  title: string
  description: string
}

export interface YoutubeVideoInfo {
  video: File
  workspaceId: string
  title: string
  description: string
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
}

export interface TwitterVideoInfo {
  video: File
  workspaceId: string
  tweetPost: string
}
