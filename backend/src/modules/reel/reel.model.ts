import mongoose, { Schema } from 'mongoose'
import validator from 'validator'
import toJSON from '../toJSON/toJSON'
import paginate from '../paginate/paginate'
import { IReelDoc, IReelModel } from './reel.interfaces'
import { User } from '../user'

const instagramSchema = new mongoose.Schema<IReelDoc, IReelModel>(
  {
    url: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate(value: string) {
        if (!validator.isURL(value)) {
          throw new Error('Invalid url')
        }
      },
    },
    userID: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: User,
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'progress', 'done'],
      default: 'pending',
    },
    downloadLink: {
      type: String,
      required: false,
      unique: false,
    },
    transcript: String,
  },
  {
    timestamps: true,
  },
)

// add plugin that converts mongoose to json
instagramSchema.plugin(toJSON)
instagramSchema.plugin(paginate)

/**
 * Check if url is taken
 * @param {string} url - The user's url
 * @returns {Promise<boolean>}
 */
instagramSchema.static('isUrlTaken', async function (url: string): Promise<boolean> {
  const user = await this.findOne({ url })
  return !!user
})

const Reel = mongoose.model<IReelDoc, IReelModel>('Reel', instagramSchema)

export default Reel
