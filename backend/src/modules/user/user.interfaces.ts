import mongoose, { Model, Document } from 'mongoose'
import { QueryResult } from '../paginate/paginate'
import { AccessAndRefreshTokens } from '../token/token.interfaces'

export interface IUser {
  name: string
  email: string
  password: string
  role: string
  isEmailVerified: boolean
  // youtube_access_token?: string
  // youtube_refresh_token?: string
  // twitter_token?: string
  // twitter_tokenSecret?: string
  scheduleTime?: string
  date?: Date
  workspaces: mongoose.Types.ObjectId[]
}

export interface IUserDoc extends IUser, Document {
  isPasswordMatch(password: string): Promise<boolean>
}

export interface IUserModel extends Model<IUserDoc> {
  isEmailTaken(email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>
  // TwitterTokenSave(id: mongoose.ObjectId, twitter_token: string, twitter_tokenSecret: string): Promise<boolean>
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>
}

export type UpdateUserBody = Partial<IUser>

export type NewRegisteredUser = Omit<
  IUser,
  | 'role'
  | 'isEmailVerified'
  // | 'youtube_access_token'
  // | 'youtube_refresh_token'
  // | 'twitter_token'
  // | 'twitter_tokenSecret'
  | 'workspaces'
  | 'scheduleTime'
  | 'date'
>

export type NewCreatedUser = Omit<
  IUser,
  | 'isEmailVerified'
  // | 'youtube_access_token'
  // | 'youtube_refresh_token'
  // | 'twitter_token'
  // | 'twitter_tokenSecret'
  | 'scheduleTime'
  | 'date'
  | 'workspaces'
>

export interface IUserWithTokens {
  user: IUserDoc
  tokens: AccessAndRefreshTokens
}

export interface ISocketUser {
  userId: string
  socketId: string
}
