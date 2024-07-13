import express from 'express'
import { ENVIRONMENT, PATH } from '../../constants'
import authRoute from './auth.route'
import docsRoute from './swagger.route'
import userRoute from './user.route'
import reelRoute from './reel.route'
import googleRoute from './google.route'
import config from '../../config/config'
import twitterRoute from './twitter.route'
import instagramRoute from './instagram.route'
import tiktokRoute from './tiktok.route'
import workspaceRoute from './workspace.route'
import { IRoute } from './types'
import uploadRoutes from './upload.route'
import chatgptRoutes from './chatgpt.route'

const router = express.Router()

const defaultIRoute: IRoute[] = [
  {
    path: PATH.AUTH,
    route: authRoute,
  },
  {
    path: PATH.USERS,
    route: userRoute,
  },
  {
    path: PATH.REEL,
    route: reelRoute,
  },
  {
    path: PATH.GOOGLE,
    route: googleRoute,
  },
  {
    path: PATH.TWITTER,
    route: twitterRoute,
  },
  {
    path: PATH.TIKTOK,
    route: tiktokRoute,
  },
  {
    path: PATH.WORKSPACE,
    route: workspaceRoute,
  },
  {
    path: PATH.UPLOAD,
    route: uploadRoutes,
  },
  {
    path: PATH.CHATGPT,
    route: chatgptRoutes,
  },
  {
    path: PATH.INSTAGRAM,
    route: instagramRoute,
  },
]

const devIRoute: IRoute[] = [
  // IRoute available only in development mode
  {
    path: PATH.DOCS,
    route: docsRoute,
  },
]

defaultIRoute.forEach((route) => {
  router.use(route.path, route.route)
})

/* istanbul ignore next */
if (config.env === ENVIRONMENT.DEVELOPMENT) {
  devIRoute.forEach((route) => {
    router.use(route.path, route.route)
  })
}

export default router
