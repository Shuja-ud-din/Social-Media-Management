import httpStatus from 'http-status'
import { Request, Response } from 'express'
import mongoose from 'mongoose'
import Queue from 'bull'
import ApiError from '../errors/ApiError'
import { IOptions } from '../paginate/paginate'
import * as reelService from './reel.service'
import { catchAsync, pick } from '../utils'

// Create a new Bull queue
export const reelProcessingQueue = new Queue('reelProcessing', {
  redis: {
    host: 'localhost', // replace with your Redis server host
    port: 6379, // replace with your Redis server port
  },
})

// @ts-ignore
reelProcessingQueue.process(async (job) => {
  const { reelId, userId } = job.data
  try {
    // eslint-disable-next-line no-console
    console.log('reelId and userID: ', reelId, ' ', userId)
    const result = await reelService.processReel(reelId, userId)
    return result
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error processing job: ', error)
  }
})

// @ts-ignore
reelProcessingQueue.on('completed', (job, result) => {
  // eslint-disable-next-line no-console
  console.log(`Job completed with result ${result}`)
})

export const createReel = catchAsync(async (req: Request, res: Response) => {
  const { user } = req
  console.log('User Reel :', user)
  const reel = await reelService.createReel(req.body, user._id)
  res.status(httpStatus.CREATED).send(reel)
})

export const getReels = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'role'])
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy'])
  const result = await reelService.queryReels(filter, options)
  res.send(result)
})

export const getReel = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['reelId'] === 'string') {
    const reel = await reelService.getReelById(new mongoose.Types.ObjectId(req.params['reelId']))
    if (!reel) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Reel not found')
    }
    res.send(reel)
  }
})

export const updateReel = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['reelId'] === 'string') {
    const reel = await reelService.updateReelById(new mongoose.Types.ObjectId(req.params['reelId']), req.body)
    res.send(reel)
  }
})

export const deleteReel = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['reelId'] === 'string') {
    await reelService.deleteReelById(new mongoose.Types.ObjectId(req.params['reelId']))
    res.status(httpStatus.NO_CONTENT).send()
  }
})

export const uploadReel = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['reelId'] !== 'string') throw new ApiError(httpStatus.NOT_FOUND, 'Reel not found')

  // Add a new job to the queue

  try {
    // eslint-disable-next-line no-console
    console.log('adding job to queue')

    const job = await reelProcessingQueue.add({
      reelId: req.params['reelId'],
      userId: req.user._id,
    })
    const status = await job.getState()
    // eslint-disable-next-line no-console
    console.log(`Job status: ${status}`)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error adding job to queue: ', error)
  }
  res.send({ message: 'Reel processing started' })
})
