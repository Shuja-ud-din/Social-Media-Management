import httpStatus from 'http-status'
import { Request, Response } from 'express'
import { catchAsync } from '../utils'
import * as workspaceService from './workspace.service'
import { User } from '../user'
import { ApiError } from '../errors'
import mongoose from 'mongoose'
import { Workspace } from '.'
import { google } from 'googleapis'
import config from '../../config/config'
import { uploadVideo } from '../youtube/youtube.service'
import { uploadTweettoTwitter } from '../twitter'

const data = config.google
const CLIENT_ID = data.client_id
const CLIENT_SECRET = data.client_secret
const REDIRECT_URI = data.redirect_uris
export const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)

export const createWorkspace = catchAsync(async (req: Request, res: Response) => {
  const { body } = req
  const userId = req.user?._id
  const workspace = await workspaceService.createWorkspace({
    ...body,
    user: userId.toString(),
  })

  const user = await User.findOne(userId)
  if (user) {
    user.workspaces.push(workspace._id)
    await user.save()
  }

  res.status(httpStatus.CREATED).send({
    message: 'Workspace created successfully',
    success: true,
    data: workspace,
  })
})

export const getAllWorkspaces = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?._id

  const workspaces = await workspaceService.getWorkspacesByUser(userId)
  res.send({
    success: true,
    data: workspaces,
  })
})

export const updateWorkspace = catchAsync(async (req: Request, res: Response) => {
  const { workspaceId } = req.params
  if (typeof workspaceId === 'string') {
    const workspace = await workspaceService.updateWorkspace(new mongoose.Types.ObjectId(workspaceId), req.body)
    res.send({
      success: true,
      message: 'Workspace updated successfully',
      data: workspace,
    })
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid workspace id')
  }
})

export const deleteWorkspace = catchAsync(async (req: Request, res: Response) => {
  const { workspaceId } = req.params
  if (typeof workspaceId === 'string') {
    await workspaceService.deleteWorkspace(new mongoose.Types.ObjectId(workspaceId), req.user?._id)

    res.send({
      success: true,
      message: 'Workspace deleted successfully',
    })
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid workspace id')
  }
})

export const getWorkspaceBySlug = catchAsync(async (req: Request, res: Response) => {
  const { slug } = req.params
  const userId = req.user?._id

  if (!slug) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Slug is required')
  }

  const workspace = await workspaceService.getWorkspaceBySlug(slug, userId)

  if (!workspace) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Workspace not found')
  }

  res.send({
    success: true,
    data: workspace,
  })
})

export const createYoutubeUrl = async (req: Request, res: Response) => {
  // eslint-disable-next-line no-console

  const { workspaceId } = req.query

  const isWorkspaceIdValid = Workspace.findById(workspaceId)

  if (!isWorkspaceIdValid) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid workspace id')
  }

  const state = workspaceId?.toString() as string
  //   handle the authentication
  const scopes = [
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube.force-ssl',
    'https://www.googleapis.com/auth/userinfo.profile',
  ]

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    state,
  })

  res.send(url)
}

export const uploadVideoToYoutube = catchAsync(async (req: Request, res: Response) => {
  const { file } = req
  const { workspaceId, title, description } = req.body

  if (!file) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No file uploaded')
  }

  if (!file.originalname.match(/\.(mp4|mov|avi)$/)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Please upload a video file')
  }

  const workspace = await Workspace.findById(workspaceId)
  if (!workspace) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid workspace id')
  }

  const response = await uploadVideo(workspace, title, description, file)

  res.status(httpStatus.OK).json({
    response: response,
  })
})

export const uploadVideoToTwitter = catchAsync(async (req: Request, res: Response) => {
  const { file } = req
  const { workspaceId, tweetPost } = req.body

  if (!file) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No file uploaded')
  }

  if (!file.originalname.match(/\.(mp4|mov|avi)$/)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Please upload a video file')
  }

  const workspace = await Workspace.findById(workspaceId)
  if (!workspace) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid workspace id')
  }

  const twitterTokens = workspace.twitter
  const accessTokenSecret = twitterTokens?.accessTokenSecret as string
  const accessToken = twitterTokens?.accessToken as string
  const mediaPath = file.path

  // const response = await uploadTweettoTwitter({ tweetPost, mediaFile: file, accessToken, accessTokenSecret })
  uploadTweettoTwitter({ tweetPost, mediaPath, accessToken, accessTokenSecret, res })
})
