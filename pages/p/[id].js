import escapeHtml from 'escape-html'
import { redis } from '../../lib/db'

export async function getServerSideProps({ params }) {
  try {
    const pasteData = await redis.get(`paste:${params.id}`)

    if (!pasteData) {
      return { notFound: true }
    }

    // Parse paste if it's a string
    const paste = typeof pasteData === 'string' ? JSON.parse(pasteData) : pasteData

    // Check if expired
    if (paste.expires_at && Date.now() > paste.expires_at) {
      return { notFound: true }
    }

    return {
      props: {
        content: escapeHtml(paste.content),
        id: params.id
      },
      revalidate: 10
    }
  } catch (error) {
    console.error('Error fetching paste:', error)
    return { notFound: true }
  }
}

export default function PastePage({ content, id }) {
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Paste: {id}</h1>
      <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
        {content}
      </pre>
      <button onClick={() => window.location.href = '/'}>Back</button>
    </div>
  )
}
