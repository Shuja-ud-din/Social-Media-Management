export interface IReel {
  url: string
  status: 'pending' | 'done' | 'progress'
}

export interface IReelCreated extends IReel {
  id: string
}

export interface IQueryReel {
  queryKey: string[]
}

export interface IReelListProps {
  page: string
  limit: string
}

type ResultStatus = 'pending' | 'done' | 'progress'

interface IResult {
  url: string
  userID: string
  status: ResultStatus
  downloadLink?: string
  transcript?: string
  id: string
}

export interface IResultsResponse {
  results: IResult[]
  page: number
  limit: number
  totalPages: number
  totalResults: number
}

export type TGetReels = ({ queryKey }: IQueryReel) => Promise<IResultsResponse>

export type TReel = (payload: IReel) => Promise<IReelCreated>

export type TReelDelete = (id: string) => Promise<string>

export type TReelProcess = ({ queryKey }: IQueryReel) => Promise<any>
