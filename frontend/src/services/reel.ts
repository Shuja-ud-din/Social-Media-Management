import { apis } from '~/constants/apis'
import instance from '~/utils/axios'
import { TGetReels, TReel, TReelDelete, TReelProcess } from '~/types/reel'

export const getReels: TGetReels = async ({ queryKey }) => {
  const [, page, limit] = queryKey
  const res = await instance.get(`${apis.reel}?page=${+page}&limit=${+limit}&sortBy=_id:desc`)
  return res?.data
}

export const createReel: TReel = async (url) => {
  const res = await instance.post(apis.reel, url)
  return res?.data
}

export const deleteReel: TReelDelete = async (id) => {
  const res = await instance.delete(`${apis.reel}/${id}`)
  return res?.data
}

export const processReel: TReelProcess = async ({ queryKey }) => {
  const [, id] = queryKey
  const res = await instance.get(`${apis.reelProcess}/${id}`)
  return res?.data
}
