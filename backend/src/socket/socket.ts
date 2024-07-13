import { Server } from 'socket.io'
import { logger } from '../modules/logger'
import app from '../app'
import config from '../config/config'
import { ISocketUser } from '../modules/user/user.interfaces'
import { verifyToken } from '../modules/token/token.service'

const server = app.listen(config.port, () => {
  logger.info(`Listening to port ${config.port} [${config.env} mode...]`)
})

const io = new Server(server, {
  cors: {
    origin: '*',
  },
})

let connectedUsers: ISocketUser[] = []

io.on('connection', (socket) => {
  console.log('a user connected', socket.id)
  socket.on('join', async (data) => {
    const user = await verifyToken(data.token, 'refresh')

    if (!user) {
      socket.emit('unauthorized', 'Invalid Token')
      socket.disconnect()
      return
    }

    // @ts-ignore
    socket.userId = user._id
    socket.join(user._id)

    connectedUsers = connectedUsers.filter((connectedUser) => connectedUser.userId === user._id)

    connectedUsers.push({ userId: user._id, socketId: socket.id })
    console.log(connectedUsers)
  })

  socket.on('disconnect', () => {
    // @ts-ignore
    console.log('user disconnected', socket.id, socket.userId)
    connectedUsers = connectedUsers.filter(
      // @ts-ignore
      (user) => user.userId != socket.userId,
    )
    console.log(connectedUsers)
  })
})

export { server, io }
