import { nanoid } from 'nanoid'
import { redis } from '../../../lib/db'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    if (!redis) {
      return res.status(503).json({ error: 'Service unavailable: Redis not configured' })
    }

    const { content, ttl_seconds, max_views } = req.body

    // Validation
    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: 'Invalid content' })
    }

    if (ttl_seconds !== undefined && ttl_seconds < 1) {
      return res.status(400).json({ error: 'Invalid ttl_seconds' })
    }

    if (max_views !== undefined && max_views < 1) {
      return res.status(400).json({ error: 'Invalid max_views' })
    }

    const id = nanoid()
    const now = Date.now()

    const paste = {
      id,
      content,
      created_at: now,
      expires_at: ttl_seconds ? now + ttl_seconds * 1000 : null,
      remaining_views: max_views ?? null
    }

    // Set with TTL if specified
    if (ttl_seconds) {
      await redis.setex(`paste:${id}`, ttl_seconds, JSON.stringify(paste))
    } else {
      await redis.set(`paste:${id}`, JSON.stringify(paste))
    }

    const baseUrl = process.env.BASE_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://pastebin-lite-chi-ashy.vercel.app'
    res.status(201).json({
      id,
      url: `${baseUrl}/p/${id}`
    })
  } catch (error) {
    console.error('Error creating paste:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
