import { redis } from '../../../lib/db'
import { getNow } from '../../../lib/time'

export default async function handler(req, res) {
  try {
    const key = `paste:${req.query.id}`
    const pasteData = await redis.get(key)

    if (!pasteData) {
      return res.status(404).json({ error: 'Not found' })
    }

    // Parse paste if it's a string
    const paste = typeof pasteData === 'string' ? JSON.parse(pasteData) : pasteData

    const now = getNow(req)

    // TTL check
    if (paste.expires_at !== null && now > paste.expires_at) {
      await redis.del(key)
      return res.status(404).json({ error: 'Expired' })
    }

    // View limit check
    if (paste.remaining_views !== null) {
      if (paste.remaining_views <= 0) {
        await redis.del(key)
        return res.status(404).json({ error: 'View limit exceeded' })
      }

      paste.remaining_views -= 1
      await redis.set(key, JSON.stringify(paste))
    }

    res.status(200).json({
      content: paste.content,
      remaining_views: paste.remaining_views,
      expires_at: paste.expires_at
        ? new Date(paste.expires_at).toISOString()
        : null
    })
  } catch (error) {
    console.error('Error fetching paste:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

