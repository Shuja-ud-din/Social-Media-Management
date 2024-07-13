import { User, Tokens } from '~/types/api/'

export interface SignUPResponse {
  user: User
  tokens: Tokens
}
