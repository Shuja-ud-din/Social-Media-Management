import axios, { AxiosResponse } from 'axios'
import { Writable } from 'stream'
import fs from 'fs'
import ffmpeg from 'fluent-ffmpeg'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { logger } from '../logger'
import { v2 as cloudinary } from 'cloudinary'
import { ApiError } from '../errors'
import config from '../../config/config'

const fileName = path.resolve()
const dirName = path.dirname(fileName)
export const root = path.join(dirName, '..', '..', '..')

async function downloadVideo(videoUrl: string): Promise<string> {
  const videoPath = path.join(root, 'videos', `${uuidv4()}.mp4`)

  logger.info('Downloading video from: ', videoUrl)
  const response: AxiosResponse = await axios({
    method: 'GET',
    url: videoUrl,
    responseType: 'stream',
  })

  const writer: Writable = fs.createWriteStream(videoPath)

  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', () => resolve(videoPath))
    writer.on('error', reject)
  })
}

function extractAudio(inputPath: string): Promise<string> {
  const outputPath = path.join(root, 'videos', `${uuidv4()}.mp3`)

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .audioCodec('libmp3lame') // Use the libmp3lame codec for MP3
      .noVideo() // No video in the output
      .audioChannels(2) // Stereo audio
      .audioFrequency(44100) // 44.1 kHz sample rate
      .audioBitrate('96k') // Lower bitrate for higher compression
      .on('end', () => {
        resolve(outputPath)
      })
      .on('error', (err) => {
        reject(err)
      })
      .save(outputPath)
  })
}

const uploadFile = async (filePath: string) => {
  cloudinary.config({
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret,
  })
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'auto',
    })
    fs.unlinkSync(filePath)
    return result
  } catch (error: any) {
    fs.unlinkSync(filePath)
    throw new ApiError(500, error.message)
  }
}

export { downloadVideo, extractAudio, uploadFile }
