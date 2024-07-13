import { fileUpload } from '../../modules/multer/multer'
import { uploadController } from '../../modules/upload'
import express from 'express'

const router = express.Router()

router.post('/image', fileUpload.single('image'), uploadController.uploadImage)

export default router
