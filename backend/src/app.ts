import express, { Express } from 'express'
import helmet from 'helmet'
import xss from 'xss-clean'
import ExpressMongoSanitize from 'express-mongo-sanitize'
import compression from 'compression'
import cors from 'cors'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import httpStatus from 'http-status'
import session from 'express-session'
import config from './config/config'
import { morgan } from './modules/logger'
import { jwtStrategy } from './modules/auth'
import { authLimiter } from './modules/utils'
import { ApiError, errorConverter, errorHandler } from './modules/errors'
import routes from './routes/v1'
import { ENVIRONMENT, PATH, VERSION } from './constants'
// import { start } from './modules/cron/cornjob'

// Passport serialization and deserialization
passport.serializeUser(function (user, done) {
  done(null, user)
})
passport.deserializeUser(function (obj, done) {
  // @ts-ignore
  done(null, obj)
})

const app: Express = express()

// Body parsing middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Cookie parsing middleware
app.use(cookieParser())

// Session middleware
// app.use(session({ secret: config.passport_secret, resave: false, saveUninitialized: true, cookie: { secure: false } }))

app.use(
  session({
    secret: config.passport_secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }),
)

// Helmet for setting secure HTTP headers
app.use(helmet())

// CORS middleware
app.use(cors())
app.options('*', cors())

// Data sanitization middleware
app.use(xss())
app.use(ExpressMongoSanitize())

// Gzip compression middleware
app.use(compression())

// Logging middleware (only in non-test environment)
if (config.env !== ENVIRONMENT.TEST) {
  app.use(morgan.successHandler)
  app.use(morgan.errorHandler)
}

// Initialize Passport and JWT authentication strategy
app.use(passport.initialize())
passport.use('jwt', jwtStrategy)

// Rate limiting middleware for authentication endpoints in production
if (config.env === ENVIRONMENT.PRODUCTION) {
  app.use(`${config.version || VERSION.V1}${PATH.AUTH}`, authLimiter)
}

app.get('/health', (_req, res) => {
  res.status(httpStatus.OK).send('Server is up and running!')
})

// API routes
app.use(`${config.version || VERSION.V1}`, routes)

// Handling 404 errors
app.use((_req, _res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'))
})

// Convert errors to ApiError
app.use(errorConverter)

// Error handling middleware
app.use(errorHandler)

export default app
