import { createClient } from 'redis'
import { config } from '../domains/config'

export const redisClient = createClient({
    url: config.redisUrl
})