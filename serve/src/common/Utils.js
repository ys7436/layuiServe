import { getValue } from '@/config/RedisConfig'
import * as config from '../config/index'
import jwt from 'jsonwebtoken'

const getJWTPayload = token => {
  return jwt.verify(token.split(' ')[1], config.JWT_SECRET)
}

const checkCode = async (key, value) => {
  const redisData = await getValue(key)
  if (redisData != null) {
    if (redisData.toLowerCase() === value.toLowerCase()) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

export {
  checkCode,
  getJWTPayload
}