import Joi from 'joi'
import { objectId } from '../validate'
import { CreateWorkspace, UpdateWorkspace } from './workspace.interface'

const createWorkspaceBody: Record<keyof CreateWorkspace, any> = {
  name: Joi.string().required(),
  description: Joi.string().required(),
  logo: Joi.string(),
  scheduleTime: Joi.number().required(),
  Youtube: Joi.string(),
  tiktok: Joi.string(),
  instagram: Joi.string(),
  facebook: Joi.string(),
  twitter: Joi.string(),
  slug: Joi.string(),
  status: Joi.string().required().valid('active', 'inactive'),
}

const updateWorkspaceBody: Record<keyof UpdateWorkspace, any> = {
  name: Joi.string(),
  description: Joi.string(),
  logo: Joi.string(),
  scheduleTime: Joi.number(),
  Youtube: Joi.string(),
  tiktok: Joi.string(),
  instagram: Joi.string(),
  facebook: Joi.string(),
  twitter: Joi.string(),
  status: Joi.string().valid('active', 'inactive'),
}

const createWorkspace = {
  body: Joi.object().keys(createWorkspaceBody),
}

const updateWorkspace = {
  params: Joi.object().keys({
    workspaceId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys(updateWorkspaceBody).min(1),
}

const deleteWorkspace = {
  params: Joi.object().keys({
    workspaceId: Joi.string().custom(objectId),
  }),
}

const getWorkspaceBySlug = {
  params: Joi.object().keys({
    slug: Joi.string().required(),
  }),
}

const oAuthLinkBody = {
  query: Joi.object().keys({
    workspaceId: Joi.string().required(),
  }),
}

const generateTitleAndDescriptionBody = {
  body: Joi.object().keys({
    prompt: Joi.string().required(),
  }),
}

const youtubeVideoBody = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    workspaceId: Joi.string().required(),
  }),
}

const twitterVideoBody = {
  body: Joi.object().keys({
    tweetPost: Joi.string().required(),
    description: Joi.string().required(),
    workspaceId: Joi.string().required(),
  }),
}

export {
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  getWorkspaceBySlug,
  oAuthLinkBody,
  generateTitleAndDescriptionBody,
  youtubeVideoBody,
  twitterVideoBody,
}
