import axios from 'axios'
import config from '../../config/config'
import qs from 'qs'

const data = config.instagram
const CLIENT_ID = data.client_id
const CLIENT_SECRET = data.client_secret
const REDIRECT_URI = data.redirect_uri

export const generateOAuthUrl = (state: string): string => {
  return `https://api.instagram.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user_profile,user_media&response_type=code&state=${state}`
  // return `https://www.facebook.com/v13.0/dialog/oauth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user_profile&response_type=code&state=${state}`
}

export const getAccessToken = async (code: string) => {
  try {
    const tokenResponse = await axios.post(
      'https://api.instagram.com/oauth/access_token',
      qs.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
        code: code.toString(),
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )

    console.log(tokenResponse.data)

    return tokenResponse.data
  } catch (e) {
    console.log(e)
  }
}
