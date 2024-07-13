import multer from 'multer'
import fs from 'fs'

const fileUpload = multer({ dest: 'public/uploads' })

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    const uploadPath = 'public/videos'
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }

    cb(null, uploadPath)
  },
  filename: function (_req, file, cb) {
    cb(null, file.originalname)
  },
})

const videoUpload = multer({ storage: storage })

export { fileUpload, videoUpload }
