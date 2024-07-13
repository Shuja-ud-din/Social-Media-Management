import Joi from 'joi'
import { objectId } from '../validate/custom.validation'
import { IReel } from './reel.interfaces'

const createReelBody: Record<keyof IReel, any> = {
  url: Joi.string().required().uri(),
  status: Joi.string().optional().valid('pending', 'done'),
  downloadLink: Joi.string().optional(),
  transcript: Joi.string().optional(),
  youtubeVideoId: Joi.string().optional(),
  userID: Joi.optional(),
}

export const createReel = {
  body: Joi.object().keys(createReelBody),
}

export const getReels = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
}

export const getReel = {
  params: Joi.object().keys({
    reelId: Joi.string().custom(objectId),
  }),
}

export const updateReel = {
  params: Joi.object().keys({
    reelId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys(createReelBody).min(1),
}

export const deleteReel = {
  params: Joi.object().keys({
    reelId: Joi.string().custom(objectId),
  }),
}

export const uploadReel = {
  params: Joi.object().keys({
    reelId: Joi.string().custom(objectId),
  }),
}
