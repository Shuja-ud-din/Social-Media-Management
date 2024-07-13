import { Document, Model, Schema } from 'mongoose'

export interface IWorkspace {
  name: string
  description?: string
  slug: string
  logo?: string
  scheduleTime?: number
  Youtube?: { accessToken: string; refreshToken: string; expiryDate: Number; loggedIn: boolean }
  tiktok?: { accessToken: string; refreshToken: string; expiryDate: Date; loggedIn: boolean }
  instagram?: { accessToken: string; refreshToken: string; expiryDate: Date; loggedIn: boolean }
  facebook?: { accessToken: string; refreshToken: string; expiryDate: Number; loggedIn: boolean }
  twitter?: {
    accessToken: string
    refreshToken: string
    accessTokenSecret: string
    expiryDate: Number
    loggedIn: boolean
  }
  user: Schema.Types.ObjectId
  status: 'active' | 'inactive'
  // collaborators?: Schema.Types.ObjectId[]
}

export interface IWorkspaceDoc extends IWorkspace, Document {}

export interface IWorkspaceModel extends Model<IWorkspaceDoc> {
  isUserValid(user: Schema.Types.ObjectId): Promise<boolean>
  isNameValid(name: string, user: Schema.Types.ObjectId): Promise<boolean>
  isSlugValid(slug: string, user: Schema.Types.ObjectId): Promise<boolean>
}

export type CreateWorkspace = Omit<IWorkspace, 'user'>

export type UpdateWorkspace = Omit<IWorkspace, 'slug' | 'user'>
