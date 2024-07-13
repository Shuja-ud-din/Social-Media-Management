import express from 'express'
import * as instagramController from '../../modules/instagram/instagram.controllers'

const router = express.Router()

router.get('/callback', instagramController.getOauthCallback)

export default router
