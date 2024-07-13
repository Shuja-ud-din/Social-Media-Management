import { Request, Response } from 'express'
import config from '../../config/config'

/**
 * Create a reel
 */
const data = config.tiktok
// const CLIENT_ID = data.client_id
const CLIENT_SECRET = data.client_secret
const REDIRECT_URI = data.redirect_uris

export const createtiktokurl = async (_req: Request, res: Response) => {
  const csrfState = Math.random().toString(36).substring(2)
  res.cookie('csrfState', csrfState, { maxAge: 60000 })

  let url = 'https://www.tiktok.com/v2/auth/authorize/'

  // the following params need to be in `application/x-www-form-urlencoded` format.
  url += `?client_key=aw9adjvgfms4shoj`
  url += `&client_secret=${CLIENT_SECRET}`
  url += '&scope=user.info.basic'
  url += '&response_type=code'
  url += `&redirect_uri=${REDIRECT_URI}`
  url += `&state=${csrfState}`

  return url
}
