import { Redis } from '@upstash/redis'

if (!process.env.REDIS_URL) {
  throw new Error('REDIS_URL environment variable is not set')
}

if (!process.env.REDIS_TOKEN) {
  throw new Error('REDIS_TOKEN environment variable is not set')
}

export const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN
})
