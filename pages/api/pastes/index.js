// POST /api/pastes - Create a new paste
import { v4 as uuidv4 } from 'uuid';
import client from '../../../lib/db';
import { getExpirationTime } from '../../../lib/time';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { content, expiresIn = 60 } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const id = uuidv4();
    const expirationTime = getExpirationTime(expiresIn);

    await client.setEx(
      `paste:${id}`,
      Math.ceil(expirationTime / 1000) - Math.ceil(Date.now() / 1000),
      JSON.stringify({ content, createdAt: Date.now() })
    );

    res.status(201).json({ id, url: `/p/${id}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
