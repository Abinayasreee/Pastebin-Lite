import { Redis } from '@upstash/redis'

let redis = null

try {
  console.log('Debug: Checking environment variables...')
  console.log('UPSTASH_REDIS_REST_URL:', process.env.UPSTASH_REDIS_REST_URL ? 'Set' : 'Not set')
  console.log('UPSTASH_REDIS_REST_TOKEN:', process.env.UPSTASH_REDIS_REST_TOKEN ? 'Set' : 'Not set')
  console.log('REDIS_URL:', process.env.REDIS_URL ? 'Set' : 'Not set')
  console.log('REDIS_TOKEN:', process.env.REDIS_TOKEN ? 'Set' : 'Not set')
  
  // Construct full Redis URL with token if both are provided
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.log('Using UPSTASH variables')
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN
    })
  } else if (process.env.REDIS_URL && process.env.REDIS_TOKEN) {
    console.log('Using custom REDIS variables')
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
