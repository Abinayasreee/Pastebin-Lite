import { Redis } from '@upstash/redis'

let redis = null

try {
  if (process.env.REDIS_URL && process.env.REDIS_TOKEN) {
    redis = new Redis({
      url: process.env.REDIS_URL,
      token: process.env.REDIS_TOKEN
    })
  } else {
    console.warn('Redis credentials not configured. Some features will be unavailable.')
  }
} catch (error) {
  console.error('Failed to initialize Redis:', error.message)
}

export { redis }
