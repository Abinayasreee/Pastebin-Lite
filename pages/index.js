// Simple UI for pastebin-lite
import { useState } from 'react';

export default function Home() {
  const [content, setContent] = useState('');
  const [expiresIn, setExpiresIn] = useState(60);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/pastes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, expiresIn: parseInt(expiresIn) }),
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data);
        setContent('');
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Pastebin Lite</h1>

      {result ? (
        <div style={{ backgroundColor: '#e8f5e9', padding: '15px', borderRadius: '4px' }}>
          <p>Paste created successfully!</p>
          <p>
            URL: <a href={result.url}>{window.location.origin}{result.url}</a>
          </p>
          <button onClick={() => setResult(null)}>Create another paste</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="content">Content:</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows="10"
              style={{ width: '100%', padding: '10px', fontFamily: 'monospace' }}
            />
          </div>

          <div style={{ marginTop: '10px' }}>
            <label htmlFor="expiresIn">Expires in (minutes):</label>
            <input
              id="expiresIn"
              type="number"
              value={expiresIn}
              onChange={(e) => setExpiresIn(e.target.value)}
              min="1"
              style={{ marginLeft: '10px' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ marginTop: '15px', padding: '10px 20px' }}
          >
            {loading ? 'Creating...' : 'Create Paste'}
          </button>
        </form>
      )}
    </div>
  );
}
