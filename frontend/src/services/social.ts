import { apis } from '~/constants/apis'
import instance from '~/utils/axios'
import { TUrl } from '~/types/social'

export const getGoogleUrl: TUrl = async ()  => {
  const res = await instance.get(
    apis.google,
  );
  return res?.data;
}

export const getTwitterUrl: TUrl = async ()  => {
  const res = await instance.get(
    apis.twitter,
  );
  return res?.data;
}

export const getTiktokUrl: TUrl = async ()  => {
  const res = await instance.get(
    apis.tiktok,
  );
  return res?.data;
}
