import { Redis } from 'ioredis'

import { REDIS_URI } from './config'

export const redis = new Redis(REDIS_URI)
