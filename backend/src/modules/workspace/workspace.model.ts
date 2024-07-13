import mongoose, { Schema } from 'mongoose'
import { IWorkspaceDoc, IWorkspaceModel } from './workspace.interface'
import validator from 'validator'
import generateSlug from '../utils/generateSlug'
import { User } from '../user'

const workspaceSchema = new mongoose.Schema<IWorkspaceDoc, IWorkspaceModel>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    trim: true,
    validate(value: string) {
      if (!validator.isSlug(value)) {
        throw new Error('Invalid slug')
      }
    },
    default: function () {
      return generateSlug(this.name)
    },
  },
  logo: {
    type: String,
    required: false,
  },
  scheduleTime: {
    type: Number,
    required: true,
    validate(value: number) {
      if (value < 30) {
        throw new Error('scheduleTime must be greater than 30 minutes')
      }
    },
  },
  Youtube: {
    accessToken: { type: String, required: false },
    refreshToken: { type: String, required: false },
    expiryDate: { type: Number, required: false },
    loggedIn: { type: Boolean, default: false },
  },
  tiktok: {
    accessToken: { type: String, required: false },
    refreshToken: { type: String, required: false },
    expiryDate: { type: Date, required: false },
    loggedIn: { type: Boolean, default: false },
  },
  instagram: {
    accessToken: { type: String, required: false },
    refreshToken: { type: String, required: false },
    expiryDate: { type: Date, required: false },
    loggedIn: { type: Boolean, default: false },
  },
  facebook: {
    accessToken: { type: String, required: false },
    refreshToken: { type: String, required: false },
    expiryDate: { type: Date, required: false },
    loggedIn: { type: Boolean, default: false },
  },
  twitter: {
    accessToken: { type: String, required: false },
    refreshToken: { type: String, required: false },
    accessTokenSecret: { type: String, required: false },
    expiryDate: { type: Number, required: false },
    loggedIn: { type: Boolean, default: false },
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  // collaborators: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: 'User',
  //   },
  // ],
})

workspaceSchema.statics['isNameValid'] = async function (name: string, user: Schema.Types.ObjectId) {
  const workspace: IWorkspaceDoc | null = await this.findOne({ name, user })

  return !!workspace
}

workspaceSchema.statics['isSlugValid'] = async function (slug: string, user: Schema.Types.ObjectId) {
  const workspace: IWorkspaceDoc | null = await this.findOne({ slug, user })

  return !workspace
}

workspaceSchema.statics['isUserValid'] = async function (user: Schema.Types.ObjectId) {
  const existUser = await User.findOne({ _id: user })

  if (!existUser) {
    throw new Error('User not found')
  }

  return !!existUser
}

const Worskspace = mongoose.model<IWorkspaceDoc, IWorkspaceModel>('Worskspace', workspaceSchema)

export default Worskspace
