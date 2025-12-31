import { useState } from 'react'

export default function Home() {
  const [content, setContent] = useState('')
  const [ttlSeconds, setTtlSeconds] = useState('')
  const [maxViews, setMaxViews] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/pastes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          ttl_seconds: ttlSeconds ? parseInt(ttlSeconds) : undefined,
          max_views: maxViews ? parseInt(maxViews) : undefined
        })
      })

      const data = await response.json()
      if (response.ok) {
        setResult(data)
        setContent('')
        setTtlSeconds('')
        setMaxViews('')
      } else {
        setError(data.error || 'Failed to create paste')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Pastebin Lite</h1>

      {result ? (
        <div style={{ backgroundColor: '#e8f5e9', padding: '15px', borderRadius: '4px', marginBottom: '20px' }}>
          <p><strong>Paste created successfully!</strong></p>
          <p>
            URL: <a href={result.url}>{result.url}</a>
          </p>
          <button onClick={() => setResult(null)}>Create another paste</button>
        </div>
      ) : null}

      {error ? (
        <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '15px', borderRadius: '4px', marginBottom: '20px' }}>
          <p><strong>Error:</strong> {error}</p>
        </div>
      ) : null}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="content"><strong>Content:</strong></label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows="10"
            style={{ width: '100%', padding: '10px', fontFamily: 'monospace', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
          <div>
            <label htmlFor="ttl"><strong>TTL (seconds):</strong></label>
            <input
              id="ttl"
              type="number"
              value={ttlSeconds}
              onChange={(e) => setTtlSeconds(e.target.value)}
              placeholder="Leave empty for no expiry"
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label htmlFor="maxViews"><strong>Max Views:</strong></label>
            <input
              id="maxViews"
              type="number"
              value={maxViews}
              onChange={(e) => setMaxViews(e.target.value)}
              placeholder="Leave empty for unlimited"
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !content.trim()}
          style={{ 
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            opacity: loading || !content.trim() ? 0.6 : 1
          }}
        >
          {loading ? 'Creating...' : 'Create Paste'}
        </button>
      </form>
    </div>
  )
}
