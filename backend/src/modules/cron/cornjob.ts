import cron from 'node-cron'
import { getReelbyUserIdStatus, updateReelById } from '../reel/reel.service'
import { getallUsers, updateUserById } from '../user/user.service'
import { reelProcessingQueue } from '../reel/reel.controller'

let task: any

export function start() {
  const cronExpression = `*/15 * * * *` // Assuming time is in the format 'HH:mm'

  task = cron.schedule(cronExpression, async () => {
    const users = await getallUsers()
    console.log('=================Users====================')
    console.log('Users: ', users)
    console.log('=================Users====================')
    const currentDate = new Date()

    const reelUserPromises = users.map(async (user: any) => {
      const userDate = new Date(user.date)
      const scheduleTime = user.scheduleTime * 60000
      const timeDifference = currentDate.getTime() - userDate.getTime()
      console.log('=================Time Differance====================')
      console.log('Time Differance: ', timeDifference)
      console.log('Schedule Time: ', scheduleTime)
      console.log('=================Time Differance====================')
      if (+timeDifference >= +scheduleTime) {
        const reel = await getReelbyUserIdStatus(user._id, 'pending')
        if (reel) {
          console.log('=================Reel Found====================')
          console.log('Reel found for user: ', user._id, reel)
          console.log('=================Reel Found====================')
          await updateUserById(user._id, { date: currentDate })
          await updateReelById(reel._id, { status: 'progress' })
          reelProcessingQueue.add({ reelId: reel.id, userId: user.id })
          return { reelId: reel.id, userID: user.id }
        }
      }
      return null
    })

    const reelUserId = await Promise.all(reelUserPromises)

    console.log('=====================Reel User Id======================')
    console.log('Reel User Id', reelUserId)
    console.log('=====================Reel User Id======================')
  })

  // Start the scheduled task
  task.start()
  console.log('========================Cron Job Started========================')

  // Log information or perform any other actions as needed
}
