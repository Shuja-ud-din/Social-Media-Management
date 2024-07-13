import express, { Router } from 'express'
import { auth } from '../../modules/auth'
import { authURL, googleLoginToken } from '../../modules/google'

const router: Router = express.Router()
router.route('/').get(auth(), authURL)
router.route('/callback').get(googleLoginToken)
export default router
