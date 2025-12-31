import { Redis } from '@upstash/redis'

let redis = null

try {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.REDIS_URL || 'https://optimal-gnat-24344.upstash.io'
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.REDIS_TOKEN || 'AV8YAAIncDI1MjBiNGEwZjA0YTY0YzcxYmJkZDkyNTFhYWY3ZjFhYnAyMjQzNDQ'
  
  console.log('Debug: Initializing Redis...')
  console.log('URL:', upstashUrl.substring(0, 30) + '...')
  console.log('Token:', upstashToken.substring(0, 20) + '...')
  
  if (upstashUrl && upstashToken) {
    redis = new Redis({
      url: upstashUrl,
      token: upstashToken
    })
    console.log('Redis initialized successfully')
  } else {
    console.warn('Redis credentials not fully configured.')
  }
} catch (error) {
  console.error('Failed to initialize Redis:', error.message)
}

export { redis }
