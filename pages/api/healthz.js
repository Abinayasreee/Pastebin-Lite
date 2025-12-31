// Health check endpoint
import client from '../../lib/db';

export default async function handler(req, res) {
  try {
    await client.ping();
    res.status(200).json({ status: 'ok' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}
