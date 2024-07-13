import { Request, Response } from 'express'
// @ts-ignore
import { generateOAuthUrl, getAccessToken } from './instagram.service'
import { Workspace } from '../workspace'
import { ApiError } from '../errors'
import httpStatus from 'http-status'
import { catchAsync } from '../utils'
import passport from 'passport'
import { Strategy as InstagramStrategy } from 'passport-instagram'
import config from '../../config/config'

const data = config.instagram
const CLIENT_ID = data.client_id
const CLIENT_SECRET = data.client_secret
const REDIRECT_URI = data.redirect_uri

export const getInstagramAuth = catchAsync(async (req: Request, res: Response) => {
  const { workspaceId } = req.params

  const workspace = await Workspace.findById(workspaceId)
  if (!workspace) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Workspace not found')
  }

  const state = workspaceId as string

  const url = generateOAuthUrl(state)

  res.send(url)
})

passport.use(
  new InstagramStrategy(
    {
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL: REDIRECT_URI,
    },
    function (accessToken, refreshToken, profile, done) {
      console.log({ accessToken, refreshToken, profile })

      done(null, profile)
    },
  ),
)

// export const getInstagramAuth = catchAsync(async (req: Request, _res: Response) => {
//   const { workspaceId } = req.params
//   const workspace = await Workspace.findById(workspaceId)
//   if (!workspace) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Workspace not found')
//   }

//   const state = workspaceId as string

//   passport.authenticate('instagram', { state, scope: ['user_profile', 'user_media'] })()
// })

export const getOauthCallback = catchAsync(async (req: Request, res: Response) => {
  const { code, state } = req.query

  if (!code || !state) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Code and state are required')
  }

  const workspace = await Workspace.findById(state)
  if (!workspace) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Workspace not found')
  }

  await getAccessToken(code as string)

  res.send('ok')
})
