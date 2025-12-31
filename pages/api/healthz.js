import { redis } from '../../lib/db'

export default async function handler(req, res) {
  if (!redis) {
    return res.status(503).json({ ok: false, message: 'Redis not configured' })
  }

  try {
    await redis.ping()
    res.status(200).json({ ok: true })
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message })
  }
}
