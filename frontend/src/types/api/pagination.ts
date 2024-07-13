export interface Pagination<T> {
  limit: number
  page: number
  totalPages: number
  totalResults: number
  results: T[]
}
