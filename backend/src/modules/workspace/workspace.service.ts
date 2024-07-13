import httpStatus from 'http-status'
import { IWorkspace, IWorkspaceDoc } from './workspace.interface'
import Worskspace from './workspace.model'
import { ApiError } from '../errors'
import mongoose from 'mongoose'
import { User } from '../user'
import generateSlug from '../utils/generateSlug'

export const createWorkspace = async (workspace: IWorkspace): Promise<IWorkspaceDoc> => {
  if (
    (await Worskspace.isNameValid(workspace.name, workspace.user)) &&
    (await Worskspace.isUserValid(workspace.user))
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Workspace name already taken')
  }

  const slug = workspace.slug || generateSlug(workspace.name)

  const isSlugValid = await Worskspace.findOne({ slug, user: workspace.user })
  if (isSlugValid) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Workspace slug already taken')
  }

  return Worskspace.create(workspace)
}

export const getWorkspaceById = (_id: mongoose.Types.ObjectId): Promise<IWorkspaceDoc | null> => {
  return Worskspace.findOne(_id)
}

export const getWorkspacesByUser = (userId: mongoose.Types.ObjectId): Promise<IWorkspaceDoc[]> => {
  return Worskspace.find({ user: userId })
}

export const getWorkspaceBySlug = (slug: string, user: mongoose.Types.ObjectId): Promise<IWorkspaceDoc | null> => {
  return Worskspace.findOne({ slug, user })
}

export const updateWorkspace = async (
  workspaceId: mongoose.Types.ObjectId,
  updateBody: Partial<IWorkspace>,
): Promise<IWorkspaceDoc | null> => {
  const workspace = await getWorkspaceById(workspaceId)
  if (!workspace) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Workspace not found')
  }

  if (
    !(await Worskspace.isNameValid(workspace.name, workspace.user)) &&
    (await Worskspace.isUserValid(workspace.user))
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Workspace name already taken')
  }

  Object.assign(workspace, updateBody)
  await workspace.save()

  return workspace
}

export const deleteWorkspace = async (
  workspaceId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
): Promise<void> => {
  const workspace = await getWorkspaceById(workspaceId)

  const user = await User.findOne(userId)

  if (user) {
    user.workspaces = user.workspaces.filter((id) => id.toString() !== workspaceId.toString())
    await user.save()
  }

  if (!workspace) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Workspace not found')
  }
  workspace?.deleteOne()
}
