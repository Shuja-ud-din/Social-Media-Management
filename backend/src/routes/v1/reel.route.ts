import express, { Router } from 'express'
import { reelController, reelValidation } from '../../modules/reel'
import { auth } from '../../modules/auth'
import { validate } from '../../modules/validate'

const router: Router = express.Router()

router
  .route('/')
  .get(auth(), validate(reelValidation.getReels), reelController.getReels)
  .post(auth(), validate(reelValidation.createReel), reelController.createReel)

router
  .route('/:reelId')
  .get(auth(), validate(reelValidation.getReel), reelController.getReel)
  .patch(auth(), validate(reelValidation.updateReel), reelController.updateReel)
  .delete(auth(), validate(reelValidation.deleteReel), reelController.deleteReel)

// router.route('/upload/:reelId').get(auth(), validate(reelValidation.uploadReel), reelController.uploadReel)

router.route('/download/:reelId').get(auth(), validate(reelValidation.uploadReel), reelController.uploadReel)

export default router
