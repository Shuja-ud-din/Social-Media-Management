import { Request, Response } from 'express'
import httpStatus from 'http-status'
import { catchAsync } from '../utils'
import { createurl, getLoginToken, refreshAccessToken } from './google.service'
import { Workspace } from '../workspace'
import { ApiError } from '../errors'

// @ts-ignore
export const authURL = catchAsync(async (req: Request, res: Response, next) => {
  const url = await createurl(req)
  res.status(httpStatus.CREATED).send(url)
})
// @ts-ignore
export const googleLoginToken = catchAsync(async (req: Request, res: Response, next) => {
  const url = await getLoginToken(req)

  res.redirect(url as string)
})

export const refreshYoutubeToken = catchAsync(async (req: Request, res: Response) => {
  const { workspaceId } = req.params

  const workspace = await Workspace.findById(workspaceId)

  if (!workspace) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Workspace not found')
  }

  if (!workspace.Youtube?.loggedIn) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Not Logged In')
  }

  if (!workspace?.Youtube?.refreshToken) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Refresh token not found')
  }

  const tokens = await refreshAccessToken(workspace?.Youtube?.refreshToken as string)

  if (workspace) {
    workspace.Youtube = {
      accessToken: tokens.accessToken as string,
      refreshToken: tokens.refreshToken as string,
      expiryDate: tokens.expiryDate as number,
      loggedIn: true,
    }
    await workspace?.save()
  }

  res.send({
    accessToken: tokens.accessToken as string,
    refreshToken: tokens.refreshToken as string,
  })
})
