// GET /p/[id] - HTML paste view
import client from '../../lib/db';

export default function PasteView({ content, id, notFound }) {
  if (notFound) {
    return (
      <div style={{ padding: '20px', fontFamily: 'monospace' }}>
        <h1>404 - Paste Not Found</h1>
        <p>The paste you're looking for doesn't exist or has expired.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Paste: {id}</h1>
      <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
        {content}
      </pre>
      <button onClick={() => window.location.href = '/'}>Back</button>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const paste = await client.get(`paste:${params.id}`);

    if (!paste) {
      return { notFound: true };
    }

    const data = JSON.parse(paste);
    return {
      props: {
        content: data.content,
        id: params.id,
      },
      revalidate: 10,
    };
  } catch (error) {
    console.error('Error fetching paste:', error);
    return { notFound: true };
  }
}
