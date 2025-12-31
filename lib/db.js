import { Redis } from '@upstash/redis'

let redis = null

try {
  // Construct full Redis URL with token if both are provided
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN
    })
  } else if (process.env.REDIS_URL && process.env.REDIS_TOKEN) {
    // Fallback for custom REDIS_URL and REDIS_TOKEN
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
