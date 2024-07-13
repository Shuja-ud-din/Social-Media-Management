import config from '../../config/config'
import { TwitterApi } from 'twitter-api-v2'
import { ITwitterLoginResponse, TTwitterLogin } from './twitter.interface'
import { ApiError } from '../errors'
import { Response } from 'express'
import Twit from 'twit'
import oAuth1a from './signature'
import httpStatus from 'http-status'
import { deleteFile } from '../utils/chatgpt'
import axios from 'axios'

const configData = config.twitter
const CONSUMER_API_KEY = configData.consumer_api_key
const CONSUMER_API_KEY_SECRET = configData.consumer_api_secret_key
const CLIENT_ID = configData.client_id
const TWITTER_REDIRECT_URI = configData.redirect_uri
const TWITTER_CLIENT_SECRET = configData.client_secret

interface IUploadVideoToTwitter {
  mediaPath: string
  tweetPost: any
  accessToken: string
  accessTokenSecret: string
  res: Response
}
// @ts-ignore
export const uploadTweettoTwitter = async ({
  tweetPost,
  mediaPath,
  accessTokenSecret,
  accessToken,
  res,
}: IUploadVideoToTwitter) => {
  const T = new Twit({
    consumer_key: CONSUMER_API_KEY,
    consumer_secret: CONSUMER_API_KEY_SECRET,
    access_token: accessToken,
    access_token_secret: accessTokenSecret,
    timeout_ms: 60 * 1000,
    strictSSL: true,
  })

  console.log('=======================Tweet Media Upload Start========================')
  // @ts-ignore
  T.postMediaChunked({ file_path: mediaPath }, function (_err, data1, response) {
    console.log('=======================Tweet Media Post Response Data========================')
    console.log(data1)
    console.log('=======================Tweet Media Post Response Data========================')

    if (_err) {
      console.log('=======================Tweet Media Post Error========================')
      console.log(_err)
      console.log('=======================Tweet Media Post Error========================')
      return
    }

    const oAuthOptions = {
      api_key: CONSUMER_API_KEY,
      api_secret_key: CONSUMER_API_KEY_SECRET,
      access_token: accessToken,
      access_token_secret: accessTokenSecret,
    }

    // @ts-ignore
    if (data1) {
      console.log('=======================Tweet Post Start========================')

      setTimeout(async () => {
        const data = {
          text: tweetPost,
          // @ts-ignore
          media: { media_ids: [data1.media_id_string] },
        }

        const url = 'https://api.twitter.com/2/tweets'
        const method = 'POST'

        const authorization = oAuth1a({ method, url }, oAuthOptions)

        try {
          const response = await axios.post(url, data, {
            headers: {
              'Content-Type': 'application/json',
              authorization,
            },
          })

          await deleteFile(mediaPath)

          res.status(httpStatus.OK).json({
            response: response.data,
          })
        } catch (err) {
          console.log('=======================Tweet Post Error========================')
          console.log(err)
          console.log('=======================Tweet Post Error========================')
          res.status(httpStatus.BAD_REQUEST).json({
            error: err,
          })
        }
      }, 5000)
    }
  })
}

const twitterClient = new TwitterApi({
  clientId: CLIENT_ID,
  clientSecret: TWITTER_CLIENT_SECRET,
})

interface IGetTwitterURL {
  url: string
  codeVerifier: string
  state: string
}

export const generateTwitterOAuthUrl = async (workspaceId: string): Promise<IGetTwitterURL> => {
  const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(TWITTER_REDIRECT_URI, {
    state: workspaceId,
    scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
  })

  // twitterClient.v2.getActiveTokens()

  return { url, codeVerifier, state }
}

export const twitterLogin: TTwitterLogin = async ({ codeVerifier, code }) => {
  const loginClient = new TwitterApi({
    clientId: CLIENT_ID,
    clientSecret: TWITTER_CLIENT_SECRET,
  })

  try {
    const {
      client: loggedClient,
      accessToken,
      refreshToken,
      expiresIn,
    } = await loginClient.loginWithOAuth2({
      code,
      codeVerifier,
      redirectUri: TWITTER_REDIRECT_URI,
    })

    console.log({ accessToken, refreshToken, expiresIn, loggedClient })

    return {
      accessToken,
      refreshToken,
      expiresIn,
    }
  } catch (error: any) {
    console.log({ error: error })

    throw new ApiError(500, error.message)
    // return error
  }
}

export const getTwitterRefreshToken = async (twitterRefreshToken: string): Promise<ITwitterLoginResponse> => {
  try {
    const {
      // client: refreshedClient,
      accessToken,
      refreshToken,
      expiresIn,
    } = await twitterClient.refreshOAuth2Token(twitterRefreshToken)

    return { accessToken, refreshToken: refreshToken as string, expiresIn }
  } catch (e: any) {
    console.log('Error:', e)
    return e
  }
}
