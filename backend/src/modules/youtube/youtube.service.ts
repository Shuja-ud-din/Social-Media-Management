import { oauth2Client } from '../workspace/workspace.controller'
import { workspaceInterface } from '../workspace'
import { ApiError } from '../errors'
import { google } from 'googleapis'
import { unlink } from 'fs/promises'
import fs from 'fs'
import { io } from '../../socket/socket'

export const uploadVideo = async (
  workspace: workspaceInterface.IWorkspace,
  title: string,
  description: string,
  file: Express.Multer.File,
) => {
  oauth2Client.setCredentials({
    access_token: workspace.Youtube?.accessToken as string,
    refresh_token: workspace.Youtube?.refreshToken as string,
  })

  const youtube = google.youtube({ version: 'v3', auth: oauth2Client })

  try {
    const response = await youtube.videos.insert(
      {
        part: ['snippet', 'status'],
        requestBody: {
          snippet: {
            title: title,
            description: description,
            categoryId: '22', // See https://developers.google.com/youtube/v3/docs/videoCategories/list
          },
          status: {
            privacyStatus: 'private', // or 'public', 'unlisted'
          },
        },
        media: {
          // @ts-ignore
          body: fs.createReadStream(file.path),
          mimeType: file.mimetype,
        },
      },
      {
        onUploadProgress: (evt) => {
          const progress = (evt.bytesRead / file.size) * 100
          io.emit('uploadProgress', { progress: Math.round(progress) })
          // console.log(`${Math.round(progress)}% complete`)
        },
      },
    )

    // Delete the file
    try {
      await unlink(file.path)
    } catch (err: any) {}

    return response.data
  } catch (error: any) {
    throw new ApiError(500, error)
    return error
  }
}
