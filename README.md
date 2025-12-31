# Pastebin Lite

A lightweight pastebin service built with Next.js and Redis. Users can create text pastes with optional TTL and view-count constraints, and share shareable links to view them.

## Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn
- Upstash Redis account (free tier available at https://upstash.com)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Abinayasreee/Pastebin-Lite.git
   cd Pastebin-Lite
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Then edit `.env.local` and add your Upstash Redis credentials:
   ```
   REDIS_URL=https://your-upstash-redis-url
   REDIS_TOKEN=your-upstash-redis-token
   BASE_URL=http://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Run tests (optional)**
   For deterministic time testing, set `TEST_MODE=1`:
   ```bash
   TEST_MODE=1 npm run dev
   ```

## Persistence Layer

**Database**: Upstash Redis (Serverless Redis)

**Why Upstash?**
- ✅ Serverless architecture (perfect for Vercel deployment)
- ✅ No infrastructure management
- ✅ Automatic scaling
- ✅ Built-in persistence
- ✅ HTTP REST API and native Redis protocol support
- ✅ Free tier sufficient for testing

**How it works:**
- Each paste is stored as a JSON string with key format: `paste:{id}`
- TTL is set on the Redis key automatically using `SETEX`
- View counts are decremented on each fetch and persisted immediately
- Expired keys are automatically removed by Redis

## API Endpoints

### Health Check
```
GET /api/healthz
```
Returns: `{ "ok": true }` (HTTP 200)

### Create a Paste
```
POST /api/pastes
Content-Type: application/json

{
  "content": "your text here",
  "ttl_seconds": 3600,
  "max_views": 5
}
```

**Rules:**
- `content` is required (non-empty string)
- `ttl_seconds` optional (integer ≥ 1, in seconds)
- `max_views` optional (integer ≥ 1)

**Response (201):**
```json
{
  "id": "abc123def456",
  "url": "https://your-domain.com/p/abc123def456"
}
```

### Fetch a Paste (JSON API)
```
GET /api/pastes/:id
```

**Response (200):**
```json
{
  "content": "your text here",
  "remaining_views": 4,
  "expires_at": "2026-01-01T12:00:00.000Z"
}
```

**Unavailable Cases (404):**
- Paste not found
- Paste expired (TTL exceeded)
- View limit exceeded

**Note:** Each API fetch counts as one view and decrements `remaining_views`.

### View a Paste (HTML)
```
GET /p/:id
```

Returns an HTML page displaying the paste content. Content is safely escaped to prevent script execution.

## Design Decisions

### 1. **Upstash Redis with HTTP REST API**
- Chosen for serverless compatibility (Vercel)
- Native TTL support reduces application complexity
- Automatic key expiration handled by Redis

### 2. **JSON Serialization**
- Pastes stored as JSON strings in Redis
- Allows flexible schema extension in future
- Easy to debug and inspect

### 3. **View Counting**
- Decremented on each API fetch
- Updated immediately in Redis (not batched)
- Provides accurate real-time counts

### 4. **Deterministic Time Testing**
- Supports `TEST_MODE=1` environment variable
- Reads `x-test-now-ms` header for testing expiry logic
- Falls back to `Date.now()` for normal operation

### 5. **HTML Safety**
- Uses `escape-html` library to prevent XSS
- Content rendered in `<pre>` tags (preserves formatting)

### 6. **Error Handling**
- Graceful fallback if Redis not configured
- Appropriate HTTP status codes (4xx for client errors, 5xx for server errors)
- Clear JSON error messages

## Project Structure

```
pastebin-lite/
├── pages/
│   ├── api/
│   │   ├── healthz.js              # GET /api/healthz
│   │   └── pastes/
│   │       ├── index.js            # POST /api/pastes
│   │       └── [id].js             # GET /api/pastes/:id
│   ├── p/
│   │   └── [id].js                 # GET /p/:id (HTML view)
│   └── index.js                    # Homepage / UI
├── lib/
│   ├── db.js                       # Redis client initialization
│   └── time.js                     # Time utilities (deterministic testing)
├── .env.local                      # Environment variables (NOT committed)
├── .gitignore                      # Git ignore rules
├── package.json                    # Dependencies
└── README.md                       # This file
```

## Deployment to Vercel

### 1. **Push to GitHub**
Already done! Repository: https://github.com/Abinayasreee/Pastebin-Lite

### 2. **Deploy to Vercel**
```bash
npm install -g vercel
vercel
```

Or connect directly in Vercel dashboard:
1. Go to https://vercel.com
2. Import project from GitHub
3. Set environment variables in project settings:
   - `REDIS_URL` - Your Upstash Redis URL
   - `REDIS_TOKEN` - Your Upstash Redis token
   - `BASE_URL` - Your Vercel deployment URL (e.g., https://your-app.vercel.app)
4. Deploy!

### 3. **Verify Deployment**
```bash
curl https://your-app.vercel.app/api/healthz
```

Should return: `{"ok":true}`

## Testing

### Manual Testing

**Create a paste:**
```bash
curl -X POST https://localhost:3000/api/pastes \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hello, world!",
    "ttl_seconds": 60,
    "max_views": 5
  }'
```

**Fetch the paste:**
```bash
curl https://localhost:3000/api/pastes/{id}
```

**View in browser:**
Visit `https://localhost:3000/p/{id}`

### Test Mode (Deterministic Time)

```bash
# Terminal 1: Start server with test mode
TEST_MODE=1 npm run dev

# Terminal 2: Create a paste
curl -X POST http://localhost:3000/api/pastes \
  -H "Content-Type: application/json" \
  -d '{"content":"test","ttl_seconds":60}'

# Terminal 3: Fetch immediately (should work)
curl -H "x-test-now-ms: 1000000000000" \
  http://localhost:3000/api/pastes/{id}

# Fetch after expiry (should 404)
curl -H "x-test-now-ms: 1000000000000000" \
  http://localhost:3000/api/pastes/{id}
```

## Code Quality Notes

✅ **No hardcoded URLs** - Dynamic URLs using `BASE_URL` environment variable
✅ **No secrets in repo** - `.env.local` in `.gitignore`, template file provided
✅ **Serverless-safe** - No global mutable state, all state in Redis
✅ **Standard setup** - `npm install && npm run dev` works out of the box
✅ **Auto-deployment** - No manual migrations needed

## Build and Production

### Build for production
```bash
npm run build
npm start
```

### Next.js Optimizations
- Automatic code splitting
- Image optimization
- Static generation where applicable
- API route optimization

## License

MIT

## Support

For issues or questions:
1. Check the GitHub Issues: https://github.com/Abinayasreee/Pastebin-Lite/issues
2. Refer to Next.js docs: https://nextjs.org/docs
3. Refer to Upstash docs: https://upstash.com/docs
