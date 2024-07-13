import mongoose from 'mongoose'
import { IYoutubeVideoDoc, IYoutubeVideo, IYoutubeVideoModel } from './youtube.interfaces'

const youtubeVideoSchema = new mongoose.Schema<IYoutubeVideoDoc, IYoutubeVideoModel>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    videoId: { type: String },
  },
  {
    timestamps: true,
  },
)

const YoutubeVideo = mongoose.model<IYoutubeVideo>('YoutubeVideo', youtubeVideoSchema)

export default YoutubeVideo
