import { io } from 'socket.io-client'
import env from '~/config/env'

const socket = io(env.REACT_APP_SERVER_URL)

export { socket }
