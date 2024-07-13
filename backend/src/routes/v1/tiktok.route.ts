import express, { Router } from 'express'
import { auth } from '../../modules/auth'
import { tiktokauthURL, tiktokCallback } from '../../modules/tiktok/tiktok.controller'

const router: Router = express.Router()
router.route('/').get(auth(), tiktokauthURL)
router.route('/callback').get(tiktokCallback)
export default router
