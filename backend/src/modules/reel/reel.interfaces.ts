import { Model, Document, Schema } from 'mongoose'
import { QueryResult } from '../paginate/paginate'

export type ReelStatus = 'pending' | 'progress' | 'done'

export interface IReel {
  url: string
  status: ReelStatus
  downloadLink?: string
  transcript?: string
  youtubeVideoId?: string
  userID?: Schema.Types.ObjectId
}

export type IReelValidation = Omit<IReel, 'userID'>

export interface IReelDoc extends IReel, Document {}

export interface IReelModel extends Model<IReelDoc> {
  isUrlTaken(url: string): Promise<boolean>
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>
}

export type UpdateReelBody = Partial<IReel>
