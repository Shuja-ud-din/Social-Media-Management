import { IUserDoc } from './modules/user/user.interfaces'

declare module 'express-serve-static-core' {
  export interface Request {
    user: IUserDoc
  }
}

import 'express-session'

declare module 'express-session' {
  interface SessionData {
    state: string
    codeVerifier: string
  }
}
