// GET /api/pastes/:id - Retrieve a paste
import client from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const paste = await client.get(`paste:${id}`);

    if (!paste) {
      return res.status(404).json({ error: 'Paste not found' });
    }

    const data = JSON.parse(paste);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
