import qs from 'querystring'
import { OAuthOptions, RequestOptions } from './types'
import { randomString, timestamp, percentEncode } from './helpers'
import signature from './modules/signature'
import * as oauth from 'oauth'
import config from '../../../config/config'

const configData = config.twitter
const CONSUMER_API_KEY = configData.consumer_api_key
const CONSUMER_API_KEY_SECRET = configData.consumer_api_secret_key
const TWITTER_REDIRECT_URI = configData.redirect_uri

export { Method, RequestOptions, OAuthOptions } from './types'

export function encode(data: any) {
  return qs.stringify(data, '&', '=', {
    encodeURIComponent: percentEncode,
  })
}

export default function oAuth1a(requestOptions: RequestOptions, oAuthOptions: OAuthOptions): string {
  const oAuthParams = {
    oauth_consumer_key: oAuthOptions.api_key,
    oauth_nonce: randomString(32),
    oauth_signature: '',
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: timestamp(),
    oauth_token: oAuthOptions.access_token,
    oauth_version: '1.0',
  }

  oAuthParams.oauth_signature = signature({
    ...requestOptions,
    oAuthOptions: { ...oAuthOptions, ...oAuthParams },
  })

  return `OAuth ${Object.entries(oAuthParams)
    .map(([key, value]) => `${percentEncode(key)}="${percentEncode(String(value))}"`)
    .join(', ')}`
}

const oauthClient = new oauth.OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  CONSUMER_API_KEY,
  CONSUMER_API_KEY_SECRET,
  '1.0A',
  TWITTER_REDIRECT_URI,
  'HMAC-SHA1',
)

export const getRequestToken = () => {
  return new Promise<{ oauth_token: string; oauth_token_secret: string }>((resolve, reject) => {
    oauthClient.getOAuthRequestToken((error, oauthToken, oauthTokenSecret) => {
      if (error) {
        reject(error)
      } else {
        resolve({ oauth_token: oauthToken, oauth_token_secret: oauthTokenSecret })
      }
    })
  })
}
