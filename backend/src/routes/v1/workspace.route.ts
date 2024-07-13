import express, { Router } from 'express'
import { workspaceController, workspaceValidation } from '../../modules/workspace'
import { validate } from '../../modules/validate'
import { auth } from '../../modules/auth'
import { catchAsync } from '../../modules/utils'
import { videoUpload } from '../../modules/multer/multer'
import { refreshYoutubeToken } from '../../modules/google'
import { getTwitterOAuth, refreshTwitterToken } from '../../modules/twitter/twitter.controller'
// import passport from 'passport'
import { getInstagramAuth } from '../../modules/instagram'

const router: Router = express.Router()

router.post('/', auth(), validate(workspaceValidation.createWorkspace), catchAsync(workspaceController.createWorkspace))
router.get('/', auth(), workspaceController.getAllWorkspaces)
router.get(
  '/:slug',
  auth(),
  validate(workspaceValidation.getWorkspaceBySlug),
  catchAsync(workspaceController.getWorkspaceBySlug),
)
router.delete(
  '/:workspaceId',
  auth(),
  validate(workspaceValidation.deleteWorkspace),
  catchAsync(workspaceController.deleteWorkspace),
)
router.put(
  '/:workspaceId',
  auth(),
  validate(workspaceValidation.updateWorkspace),
  catchAsync(workspaceController.updateWorkspace),
)

// Youtube
router.get(
  '/youtube/createUrl',
  validate(workspaceValidation.oAuthLinkBody),
  auth(),
  catchAsync(workspaceController.createYoutubeUrl),
)
router.get('/youtube/refreshToken/:workspaceId', auth(), catchAsync(refreshYoutubeToken))
router.post(
  '/youtube/uploadVideo',
  // validate(workspaceValidation.youtubeVideoBody),
  videoUpload.single('video'),
  auth(),
  workspaceController.uploadVideoToYoutube,
)

// twitter
router.get('/twitter/auth/:workspaceId', getTwitterOAuth)
router.post(
  '/twitter/uploadVideo',
  // validate(workspaceValidation.twitterVideoBody),
  // auth(),
  videoUpload.single('video'),
  workspaceController.uploadVideoToTwitter,
)
router.get('/twitter/refreshToken/:workspaceId', catchAsync(refreshTwitterToken))

// instagram
router.get('/instagram/auth/:workspaceId', getInstagramAuth)
// router.get('/instagram/auth/:workspaceId', passport.authenticate('instagram'))

export default router
