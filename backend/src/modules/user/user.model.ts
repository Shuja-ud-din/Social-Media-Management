import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import toJSON from '../toJSON/toJSON'
import paginate from '../paginate/paginate'
import { Roles } from '../../config/roles'
import { IUserDoc, IUserModel } from './user.interfaces'

const userSchema = new mongoose.Schema<IUserDoc, IUserModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email')
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value: string) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number')
        }
      },
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: Roles,
      default: Roles.USER,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    // youtube_access_token: { type: String, required: false },
    // youtube_refresh_token: { type: String, required: false },
    // twitter_token: { type: String, required: false },
    // twitter_tokenSecret: { type: String, required: false },

    workspaces: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
        default: [],
      },
    ],

    scheduleTime: {
      type: Number,
      required: false,
      validate(value: number) {
        if (value < 30) {
          throw new Error('scheduleTime must be greater than 30 minutes')
        }
      },
    },
    date: { type: Date, required: false },
  },
  {
    timestamps: true,
  },
)

// add plugin that converts mongoose to json
userSchema.plugin(toJSON)
userSchema.plugin(paginate)

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.static('isEmailTaken', async function (email: string, excludeUserId: mongoose.ObjectId): Promise<boolean> {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } })
  return !!user
})

// twitter token sace in db for future use
// userSchema.method(
//   'TwitterTokenSave',
//   async function (id: mongoose.ObjectId, twitter_token: string, twitter_tokenSecret: string): Promise<boolean> {
//     const User = this.constructor as any
//     const user = await User.findByIdAndUpdate(
//       id,
//       {
//         twitter_token,
//         twitter_tokenSecret,
//       },
//       { new: true },
//     )
//     return !!user
//   },
// )
/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.method('isPasswordMatch', async function (password: string): Promise<boolean> {
  const user = this
  return bcrypt.compare(password, user.password)
})

userSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

const User = mongoose.model<IUserDoc, IUserModel>('User', userSchema)

export default User
