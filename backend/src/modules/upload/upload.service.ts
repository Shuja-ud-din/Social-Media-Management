import ffmpeg from 'fluent-ffmpeg'
import ffmpegPath from 'ffmpeg-static'
import fs from 'fs'

ffmpeg.setFfmpegPath(ffmpegPath as string)

export const convertToMp4 = async (inputFile: string, outPutFile: string) => {
  const response = await ffmpeg(inputFile)
    .output(outPutFile)
    .on('end', () => {
      fs.unlinkSync(inputFile)
    })
    .on('error', (err) => {
      console.error('Conversion error: ', err)
    })
    .run()

  return response
}
