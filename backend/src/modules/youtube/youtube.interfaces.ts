import { Model, Document } from 'mongoose'

export interface IYoutubeVideo {
  title: string
  description: string
  videoId?: string
}

export interface IYoutubeVideoDoc extends IYoutubeVideo, Document {}

export interface IYoutubeVideoModel extends Model<IYoutubeVideoDoc> {}

export type UpdateYoutubeVideoBody = Partial<IYoutubeVideo>
