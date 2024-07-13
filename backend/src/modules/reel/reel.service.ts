import httpStatus from 'http-status'
import mongoose, { Schema } from 'mongoose'
import Reel from './reel.model'
import ApiError from '../errors/ApiError'
import { IOptions, QueryResult } from '../paginate/paginate'
import { UpdateReelBody, IReelDoc, IReelValidation } from './reel.interfaces'
import { getReelDownloadLink } from './reel.helper'
import { downloadVideo, extractAudio, getAudioTranscript } from '../utils'
import { getUserById } from '../user/user.service'
import { deleteFile } from '../utils/chatgpt'

/**
 * Create a reel
 * @param {IReel} reelBody
 * @returns {Promise<IReelDoc>}
 */
export const createReel = async (reelBody: IReelValidation, id: Schema.Types.ObjectId): Promise<IReelDoc> => {
  if (await Reel.isUrlTaken(reelBody.url)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Reel already added!')
  }
  return Reel.create({ ...reelBody, userID: id })
}

/**
 * Query for reels
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryReels = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  return Reel.paginate(filter, options)
}

/**
 * Get Reel by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IReelDoc | null>}
 */
export const getReelById = async (id: mongoose.Types.ObjectId): Promise<IReelDoc | null> => Reel.findById(id)

/**
 * Update reel by id
 * @param {mongoose.Types.ObjectId} reelId
 * @param {UpdateReelBody} updateBody
 * @returns {Promise<IReelDoc | null>}
 */
export const updateReelById = async (
  reelId: mongoose.Types.ObjectId,
  updateBody: UpdateReelBody,
): Promise<IReelDoc | null> => {
  const reel = await getReelById(reelId)
  if (!reel) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Reel not found')
  }
  if (updateBody.url && (await Reel.isUrlTaken(updateBody.url))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Reel Url already taken')
  }
  Object.assign(reel, updateBody)
  await reel.save()
  return reel
}

/**
 * Delete reel by id
 * @param {mongoose.Types.ObjectId} reelId
 * @returns {Promise<IReelDoc | null>}
 */
export const deleteReelById = async (reelId: mongoose.Types.ObjectId): Promise<IReelDoc | null> => {
  const reel = await getReelById(reelId)
  if (!reel) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Reel not found')
  }
  await reel.deleteOne()
  return reel
}

export const getReelbyUserIdStatus = async (
  userId: mongoose.Types.ObjectId,
  status: string,
): Promise<IReelDoc | null> => {
  return Reel.findOne({ userID: userId, status })
}

/**
 * Return downloadable link for a reel
 * @param {string} url
 * @param userId
 * @returns {Promise<string | undefined>}
 */
export const processReel = async (url: string, userId: mongoose.Types.ObjectId): Promise<string> => {
  // eslint-disable-next-line no-console
  console.log('Processing reel: ', url)
  const reel = await getReelById(new mongoose.Types.ObjectId(url))
  if (!reel) throw new ApiError(httpStatus.NOT_FOUND, 'Reel not found')

  if (!reel.downloadLink) {
    reel.downloadLink = await getReelDownloadLink(reel.url)
    await reel.save()
  }

  const videoPath = await downloadVideo(reel.downloadLink)
  // eslint-disable-next-line no-console
  console.log('videoPath: ', videoPath)

  const audioPath = await extractAudio(videoPath)

  if (!reel.transcript) {
    const { text } = await getAudioTranscript(audioPath)
    reel.transcript = text
    await reel.save()
  }

  // @ts-ignore
  const user = await getUserById(userId)

  // await uploadVideoToYoutube(reel, user, videoPath)

  await deleteFile(audioPath)

  return reel.transcript

  // TODO: Get title & description for youtube from chatGPT
  // TODO: Upload Video to YouTube with title, description and transcript
  // TODO: Update status of the reel & Delete respective files from the system
}
