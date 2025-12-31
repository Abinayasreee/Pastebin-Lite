import { redis } from '../../lib/db'

export default async function handler(req, res) {
  try {
    await redis.ping()
    res.status(200).json({ ok: true })
  } catch {
    res.status(500).json({ ok: false })
  }
}
