import { Request, Response } from 'express'
import { Workspace } from '../workspace'
import { generateTwitterOAuthUrl, getTwitterRefreshToken, twitterLogin } from './twitter.service'
import { ApiError } from '../errors'
import httpStatus from 'http-status'
import { catchAsync } from '../utils'
import config from '../../config/config'
import { getRequestToken } from './signature'

export const getTwitterOAuth = catchAsync(async (req: Request, res: Response) => {
  const { workspaceId } = req.params

  const isWorkspaceIdValid = Workspace.findById(workspaceId)
  if (!isWorkspaceIdValid) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid workspace id')
  }

  const { url, codeVerifier: verifier, state } = await generateTwitterOAuthUrl(workspaceId as string)

  // codeVerifier = verifier
  req.session.codeVerifier = verifier
  req.session.state = state

  res.redirect(url)
})

// @ts-ignore
export const twitterCallBack = async (req: Request, res: Response) => {
  const { state, code } = req.query
  const { codeVerifier, state: sessionState } = req.session

  if (!codeVerifier || !state || !sessionState || !code) {
    return res.status(400).send('You denied the app or your session expired!')
  }
  if (state !== sessionState) {
    return res.status(400).send('Stored tokens didnt match!')
  }

  const workspaceId = state as string
  console.log({ codeVerifier })

  const response = await twitterLogin({ code: code as string, codeVerifier: codeVerifier as string })
  req.session.state = ''
  req.session.codeVerifier = ''

  const workspace = await Workspace.findById(workspaceId)
  const { oauth_token_secret } = await getRequestToken()
  if (workspace) {
    // @ts-ignore
    workspace.twitter = {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      expiryDate: Date.now() + response.expiresIn * 1000,
      accessTokenSecret: oauth_token_secret,
      loggedIn: true,
    }

    await workspace.save()
  }

  res.redirect(`${config.frontend_url}/user/workspaces/${workspace?.slug}`)
}

export const refreshTwitterToken = catchAsync(async (req: Request, res: Response) => {
  const { workspaceId } = req.params

  const workspace = await Workspace.findById(workspaceId)

  if (!workspace) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Workspace not found')
  }

  if (!workspace?.twitter?.loggedIn) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Not Logged In')
  }

  if (!workspace?.twitter?.refreshToken) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Refresh token not found')
  }

  const tokens = await getTwitterRefreshToken(workspace?.twitter?.refreshToken as string)

  if (workspace.twitter) {
    const twitterInfo = workspace.twitter
    workspace.twitter = {
      ...twitterInfo,
      accessToken: tokens.accessToken as string,
      refreshToken: tokens.refreshToken as string,
      expiryDate: Date.now() + tokens.expiresIn * 1000,
      loggedIn: true,
    }
    await workspace?.save()
  }

  res.send({
    success: true,
    message: 'Token refreshed successfully',
  })
})
