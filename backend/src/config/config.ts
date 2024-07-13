import fs from 'fs'
import Joi from 'joi'
import { config as dotEnvConfig } from 'dotenv'
import { ENVIRONMENT } from '../constants'

const loadEnvFile = () => {
  switch (process.env['NODE_ENV']) {
    case ENVIRONMENT.PRODUCTION:
      if (fs.existsSync('.env.production')) {
        // eslint-disable-next-line global-require
        dotEnvConfig({ path: '.env.production' })
      } else {
        // eslint-disable-next-line global-require
        dotEnvConfig({ path: '.env' })
      }
      break
    case ENVIRONMENT.TEST:
      // eslint-disable-next-line global-require
      dotEnvConfig({ path: '.env.test' })
      break
    case ENVIRONMENT.DEVELOPMENT:
      // eslint-disable-next-line global-require
      dotEnvConfig({ path: '.env.development' })
      break
    default:
      // eslint-disable-next-line global-require
      dotEnvConfig({ path: '.env.development' })
  }
}

loadEnvFile()

// eslint-disable-next-line no-console
// console.log({ env: process.env })

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid(...Object.values(ENVIRONMENT))
      .required(),
    PORT: Joi.number().default(3000),
    FRONTEND_URL: Joi.string().required().description('Frontend url'),
    BACKEND_URL: Joi.string().required().description('Backend url'),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    CLIENT_URL: Joi.string().required().description('Client url'),
    CLIENT_ID: Joi.string().required().description('Client id'),
    CLIENT_SECRET: Joi.string().required().description('Client secret'),
    REDIRECT_URI: Joi.string().required().description('Redirect uri'),
    TWITTER_CONSUMER_API_KEY: Joi.string().required().description('Twitter consumer api key'),
    TWITTER_CONSUMER_API_SECRET_KEY: Joi.string().required().description('Twitter consumer api secret'),
    TWITTER_CLIENT_ID: Joi.string().required().description('Twitter Client ID'),
    REDIRECT_URI_TWITTER: Joi.string().required().description('Twitter redirect url'),
    TIKTOK_CLIENT_API_KEY: Joi.string().required().description('Tiktok client api key'),
    TIKTOK_CLIENT_API_SECRET_KEY: Joi.string().required().description('Tiktok client api secret'),
    REDIRECT_URI_TIKTOK: Joi.string().required().description('Tiktok redirect url'),
    CLOUDINARY_CLOUD_NAME: Joi.string().required().description('Cloudinary cloud name'),
    CLOUDINARY_API_KEY: Joi.string().required().description('Cloudinary API KEY'),
    CLOUDINARY_API_SECRET: Joi.string().required().description('Cloudinary API Secret'),
    INSTAGRAM_APP_ID: Joi.string().required().description('Instagram app id'),
    INSTAGRAM_APP_SECRET: Joi.string().required().description('Instagram app secret'),
    INSTAGRAM_REDIRECT_URI: Joi.string().required().description('Instagram redirect uri'),
  })
  .unknown()

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env)

if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  frontend_url: envVars.FRONTEND_URL,
  backend_url: envVars.BACKEND_URL,
  passport_secret: envVars.PASSPORT_SECRET,
  version: envVars.VERSION,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === ENVIRONMENT.TEST ? '-test' : ''),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    cookieOptions: {
      httpOnly: true,
      secure: envVars.NODE_ENV === ENVIRONMENT.PRODUCTION,
      signed: true,
    },
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  clientUrl: envVars.CLIENT_URL,
  google: {
    client_id: envVars.CLIENT_ID,
    client_secret: envVars.CLIENT_SECRET,
    redirect_uris: envVars.REDIRECT_URI,
  },
  youtube: {
    callback: envVars.YOUTUBE_CALLBACK_URI,
  },
  instagram: {
    client_id: envVars.INSTAGRAM_APP_ID,
    client_secret: envVars.INSTAGRAM_APP_SECRET,
    redirect_uri: envVars.INSTAGRAM_REDIRECT_URI,
  },
  twitter: {
    consumer_api_key: envVars.TWITTER_CONSUMER_API_KEY,
    consumer_api_secret_key: envVars.TWITTER_CONSUMER_API_SECRET_KEY,
    redirect_uri: envVars.REDIRECT_URI_TWITTER,
    client_id: envVars.TWITTER_CLIENT_ID,
    client_secret: envVars.TWITTER_CLIENT_SECRET,
  },
  tiktok: {
    client_id: envVars.TIKTOK_CLIENT_API_KEY,
    client_secret: envVars.TIKTOK_CLIENT_API_SECRET_KEY,
    redirect_uris: envVars.REDIRECT_URI_TIKTOK,
  },
  cloudinary: {
    cloud_name: envVars.CLOUDINARY_CLOUD_NAME,
    api_key: envVars.CLOUDINARY_API_KEY,
    api_secret: envVars.CLOUDINARY_API_SECRET,
  },
}

export default config
