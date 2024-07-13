import fs from 'fs'
import mongoose from 'mongoose'
import path from 'path'
// eslint-disable-next-line import/no-cycle
import axios from 'axios'
// import axiosApiInstance from './axiosInstance'
import User from '../user/user.model'
// import { setUserId } from './userIdStore'

// Replace with your access token
// eslint-disable-next-line import/no-mutable-exports
/*

export const uploadVideo = async (userid: mongoose.Types.ObjectId) => {
  // setUserId(userid)
  // Replace with your video file path
  const root = path.join(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..'))
  const videoPath = path.join(root, 'videos', `behappy.mp4`)

  // eslint-disable-next-line no-console
  console.log('Youtube userid', userid)

  const token = await User.findById(userid)
    .select('youtube_access_token')
    .then((user) => user?.youtube_access_token)
  // eslint-disable-next-line no-console
  console.log('token youtube: ', token)
  const title = 'Node.js YouTube Upload Test'
  const description = 'Testing YouTube upload via Google APIs Node.js Client'
  // @ts-ignore
  axios
    .post('https://www.googleapis.com/upload/youtube/v3/videos', {
      params: {
        part: ['snippet', 'status'],
        uploadType: 'multipart',
      },
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/octet-stream',
        'X-Upload-Content-Length': fs.statSync(videoPath).size,
        'X-Upload-Content-Type': 'video/!*',
        // 'client-id': userid.toString(),
      },
      requestBody: {
        snippet: {
          title,
          description,
        },
        status: {
          privacyStatus: 'private',
        },
      },
      media: {
        body: fs.createReadStream(videoPath),
      },
    })
    .then((response) => {
      // eslint-disable-next-line no-console
      console.log('Video uploaded successfully:', response.data)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Error uploading video:', error)
    })
}
*/

export const uploadVideo = async (userid: mongoose.Types.ObjectId) => {
  const fileName = path.resolve()
  const dirName = path.dirname(fileName)
  const root = path.join(dirName, '..', '..', '..')
  const videoPath = path.join(root, 'videos', `behappy.mp4`)

  const user = await User.findById(userid)
  const token = user?.workspaces[0]

  axios
    .post('https://www.googleapis.com/upload/youtube/v3/videos', {
      params: {
        part: ['snippet', 'status'],
        uploadType: 'multipart',
      },
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/octet-stream',
        'X-Upload-Content-Length': fs.statSync(videoPath).size,
        'X-Upload-Content-Type': 'video/*',
      },
      requestBody: {
        snippet: {
          title: 'Node.js YouTube Upload Test',
          description: 'Testing YouTube upload via Google APIs Node.js Client',
        },
        status: {
          privacyStatus: 'private',
        },
      },
      media: {
        body: fs.createReadStream(videoPath),
      },
    })
    .then(() => {
      // eslint-disable-next-line no-console
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Error uploading video:', error)
    })
}
