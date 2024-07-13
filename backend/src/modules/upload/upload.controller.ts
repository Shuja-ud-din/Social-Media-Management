import { Request, Response } from 'express'
import { catchAsync } from '../utils'
import { ApiError } from '../errors'
import httpStatus from 'http-status'
import { uploadFile } from '../utils/fileHandler'

export const uploadImage = catchAsync(async (req: Request, res: Response) => {
  const { file } = req

  if (!file) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No file uploaded')
  }

  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Please upload an image file')
  }

  const response = await uploadFile(file.path)

  res.status(httpStatus.OK).json({
    message: 'Image uploaded successfully',
    url: response.url,
  })
})
