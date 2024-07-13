import { google } from 'googleapis'
import { Request } from 'express'
import mongoose from 'mongoose'
import config from '../../config/config'
import { Workspace } from '../workspace'
import { ApiError } from '../errors'
import httpStatus from 'http-status'

/**
 * Create a reel
 */
const data = config.google
const CLIENT_ID = data.client_id
const CLIENT_SECRET = data.client_secret
const REDIRECT_URI = data.redirect_uris
const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)

export const createurl = async (req: Request) => {
  // eslint-disable-next-line no-console
  const state = req.user._id.toString()
  //   handle the authentication
  const scopes = [
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube.force-ssl',
    'https://www.googleapis.com/auth/userinfo.profile',
  ]

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    state,
  })
}

export const getLoginToken = async (req: Request): Promise<String> => {
  const { code } = req.query
  const state = new mongoose.Types.ObjectId(req.query['state'] as string)

  // eslint-disable-next-line no-console
  const workspace = await Workspace.findById(state)
  if (code) {
    oauth2Client.getToken(code as string, async (err, tokens) => {
      if (err) throw err
      // eslint-disable-next-line no-console
      if (tokens) {
        oauth2Client.setCredentials(tokens)

        if (!workspace) {
          throw new Error('Workspace not found')
        }

        if (workspace) {
          workspace.Youtube = {
            accessToken: tokens.access_token as string,
            expiryDate: tokens.expiry_date as number,
            refreshToken: tokens.refresh_token as string,
            loggedIn: true,
          }
          await workspace?.save()
        }
        // eslint-disable-next-line no-console
      }
    })
  }
  return `${config.frontend_url}/user/workspaces/${workspace?.slug}`
}

export const refreshAccessToken = async (refreshToken: string) => {
  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  })

  try {
    await oauth2Client.refreshAccessToken()
    return {
      accessToken: oauth2Client.credentials.access_token,
      refreshToken: oauth2Client.credentials.refresh_token,
      expiryDate: oauth2Client.credentials.expiry_date,
    }
  } catch (e) {
    console.error(e)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error refreshing access token')
  }
}
