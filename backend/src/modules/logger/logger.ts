import winston from 'winston'
import { ENVIRONMENT } from '../../constants'
import config from '../../config/config'

interface LoggingInfo {
  level: string
  message: string
}

const enumerateErrorFormat = winston.format((info: LoggingInfo) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack })
  }
  return info
})

const logger = winston.createLogger({
  level: config.env === ENVIRONMENT.DEVELOPMENT ? 'debug' : 'info',
  format: winston.format.combine(
    enumerateErrorFormat(),
    config.env === ENVIRONMENT.DEVELOPMENT ? winston.format.colorize() : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.printf((info: LoggingInfo) => `${info.level}: ${info.message}`),
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error'],
    }),
  ],
})

export default logger
