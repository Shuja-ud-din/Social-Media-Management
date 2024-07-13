import { IUser } from '~/types/auth'

export type TGetUser = () => Promise<IUser>;
export type TUserscheduleTime = (time: string) => Promise<IUser>;
