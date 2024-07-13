import { apis } from '~/constants/apis'
import instance from '~/utils/axios'
import { TGetUser, TUserscheduleTime } from '~/types/user'

export const getMe: TGetUser = async ()  => {
  const res = await instance.get(
    apis.getMe,
  );
  return res?.data;
}

export const UserscheduleTime: TUserscheduleTime = async (time)  => {
  const res = await instance.get(
    `${apis.sheduleTime}?time=${time}`,
  );
  return res?.data;
}