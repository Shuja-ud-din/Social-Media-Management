import { Progress } from 'antd'
import React, { useEffect, useState } from 'react'

interface IProgressProps {
  name: string
  progressValue?: number
  isCompleted?: boolean
}

const SocialMediProgress = ({ name, progressValue, isCompleted }: IProgressProps) => {
  const [randomProgress, setRandomProgress] = useState<number>(0)

  const randomizeProgress = () => {
    const interval = setInterval(() => {
      setRandomProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 90
        } else if (prev >= 90) {
          clearInterval(interval)
          return prev
        }
        return prev + 10
      })
    }, 500)

    return () => clearInterval(interval)
  }

  useEffect(() => {
    if (progressValue === undefined) randomizeProgress()
  }, [])

  useEffect(() => {
    if (isCompleted) setRandomProgress(100)
  }, [isCompleted])

  return (
    <div className="flex justify-between gap-6">
      <p>{name}</p>
      <Progress percent={progressValue || randomProgress} status="active" />
    </div>
  )
}

export default SocialMediProgress
