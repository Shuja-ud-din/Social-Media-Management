interface ITwitterLogin {
  codeVerifier: string
  code: string
}

export interface ITwitterOAuthUrl {
  url: string
  codeVerifier: string
  state: string
}

export interface ITwitterLoginResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export type TTwitterLogin = (payload: ITwitterLogin) => Promise<ITwitterLoginResponse | any>
export type TGenerateTwitterOAuthUrl = (workspaceId: string) => Promise<ITwitterOAuthUrl>
