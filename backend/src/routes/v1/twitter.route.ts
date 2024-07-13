import express, { Router } from 'express'
import { twitterCallBack } from '../../modules/twitter/twitter.controller'

const router: Router = express.Router()
// @ts-ignore
router.get('/callback', twitterCallBack)

export default router
