import { Request, Response } from 'express'
import httpStatus from 'http-status'
import { catchAsync } from '../utils'
import { createtiktokurl } from './tiktok.service'

// @ts-ignore
export const tiktokauthURL = catchAsync(async (req: Request, res: Response, next) => {
  const url = await createtiktokurl(req, res)
  res.status(httpStatus.CREATED).send(url)
})

export const tiktokCallback = async (req: Request, res: Response) => {
  console.log('req.query: ', req.query)
  const { code, state } = req.query
  console.log('code: ', code)
  console.log('state: ', state)

  res.redirect('http://localhost:3000')
}
