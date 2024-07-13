import fs from 'fs'
import OpenAI, { toFile } from 'openai'
import { ApiError } from '../errors'

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'] || '', // This is the default and can be omitted
})

const getAudioTranscript = async (path: string) => {
  const file = await toFile(fs.createReadStream(path))

  return openai.audio.transcriptions.create({ model: 'whisper-1', file })
}

const getTitleAndDescription = async (prompt: string): Promise<any> => {
  // Logic for generating title
  const title = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'system', content: prompt }],
    temperature: 1,
    stream: false,
  })

  if (title.choices && title.choices[0]) {
    return title.choices[0].message.content
  }
  // eslint-disable-next-line no-console
  throw new ApiError(500, 'No choices returned from the API')
}

const deleteFile = async (path: string) => {
  fs.unlink(path, function (err) {
    if (err) return console.log(err)
  })
}

export { getAudioTranscript, getTitleAndDescription, deleteFile }
