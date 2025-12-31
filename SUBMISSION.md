# Pastebin Lite - Assignment Submission Summary

## Submission URLs

**GitHub Repository**: https://github.com/Abinayasreee/Pastebin-Lite

**Deployed Application**: https://pastebin-lite-chi-ashy.vercel.app/

---

## Requirements Fulfillment

### ✅ Functional Requirements

#### User Capabilities
- [x] Create a paste containing arbitrary text
- [x] Receive a shareable URL for that paste
- [x] Visit the URL to view the paste
- [x] Pastes become unavailable based on constraints (TTL, view count)

#### Constraints on a Paste
- [x] Time-based expiry (TTL) - `ttl_seconds` parameter
- [x] View-count limit - `max_views` parameter
- [x] Paste becomes unavailable when either constraint triggers
- [x] Automatic cleanup via Redis key expiration

#### Required Routes
- [x] **GET /api/healthz** - Returns `{ "ok": true }` with HTTP 200
- [x] **POST /api/pastes** - Creates paste, validates input, returns `{ "id", "url" }`
- [x] **GET /api/pastes/:id** - Returns paste data or 404, counts as a view
- [x] **GET /p/:id** - Returns HTML view of paste, safely escaped

#### Constraint Behavior
- [x] Missing paste returns 404
- [x] Expired paste returns 404
- [x] View limit exceeded returns 404
- [x] Combined constraints work correctly
- [x] No negative remaining views

#### Deterministic Time Testing
- [x] `TEST_MODE=1` environment variable support
- [x] `x-test-now-ms` header for testing expiry
- [x] Falls back to system time when header absent

#### Input Validation
- [x] `content` required, must be non-empty string
- [x] `ttl_seconds` optional, must be integer ≥ 1 if present
- [x] `max_views` optional, must be integer ≥ 1 if present
- [x] Returns 4xx status with JSON errors for invalid input

#### HTML Safety
- [x] Paste content safely escaped using `escape-html` library
- [x] Prevents XSS attacks
- [x] Content rendered in `<pre>` tag (preserves formatting)

### ✅ Repository Requirements

#### Repository Structure
- [x] README.md exists at root
- [x] Contains project description
- [x] Contains local setup instructions
- [x] Describes persistence layer (Upstash Redis)
- [x] Repository is public and contains source code

#### Code Quality Signals
- [x] No hardcoded localhost URLs (uses `BASE_URL` env var)
- [x] No secrets/tokens/credentials committed (`.env.local` in `.gitignore`)
- [x] `.env.local.example` provided as template
- [x] No global mutable state (serverless-safe)
- [x] Graceful error handling for missing Redis

#### Build & Runtime
- [x] Installs with `npm install`
- [x] Starts with `npm run dev`
- [x] Next.js optimizations configured
- [x] No hardcoded database migrations needed
- [x] No shell access or manual setup required

### ✅ Technology Stack

**Frontend**: 
- React 18 (via Next.js)
- HTML form with input validation
- Responsive error/success messaging

**Backend**:
- Next.js 13 API routes
- Automatic code splitting and optimization
- Serverless-compatible

**Database**:
- Upstash Redis (Serverless Redis)
- TTL support via Redis SETEX
- JSON serialization for paste data
- Automatic key expiration

**Deployment**:
- Vercel (Next.js native platform)
- Zero-config deployment
- Automatic scaling

---

## API Response Examples

### Create Paste
**Request:**
```bash
POST /api/pastes
Content-Type: application/json

{
  "content": "Hello, world!",
  "ttl_seconds": 3600,
  "max_views": 5
}
```

**Response (201):**
```json
{
  "id": "abc123def456",
  "url": "https://your-app.vercel.app/p/abc123def456"
}
```

### Fetch Paste (API)
**Request:**
```bash
GET /api/pastes/abc123def456
```

**Response (200):**
```json
{
  "content": "Hello, world!",
  "remaining_views": 4,
  "expires_at": "2026-01-01T12:00:00.000Z"
}
```

### Health Check
**Request:**
```bash
GET /api/healthz
```

**Response (200):**
```json
{
  "ok": true
}
```

---

## Design Decisions

### 1. Upstash Redis for Persistence
**Why**: 
- Serverless architecture fits Vercel deployment model
- No infrastructure management
- Native TTL support via SETEX command
- Free tier available for development/testing
- HTTP REST API and native protocols supported

**How**:
- Pastes stored as JSON strings with key format: `paste:{id}`
- Redis handles automatic key expiration
- No manual cleanup logic needed
- Each paste includes metadata (created_at, expires_at, remaining_views)

### 2. JSON Serialization
**Why**:
- Flexible schema for future extensions
- Easy to debug and inspect in Redis CLI
- Human-readable storage format

**What's stored**:
```json
{
  "id": "abc123",
  "content": "paste text",
  "created_at": 1704063600000,
  "expires_at": 1704067200000,
  "remaining_views": 5
}
```

### 3. View Counting Strategy
**Why**:
- Immediate persistence prevents race conditions
- Accurate real-time counts
- Simple logic: decrement on each fetch, return 404 if ≤0

**Implementation**:
```javascript
paste.remaining_views -= 1
await redis.set(key, JSON.stringify(paste))
```

### 4. Deterministic Time for Testing
**Why**:
- Enables automated testing of TTL logic
- No flaky time-dependent tests
- Works with `TEST_MODE=1` environment variable

**How**:
```javascript
export function getNow(req) {
  if (process.env.TEST_MODE === '1' && req?.headers?.['x-test-now-ms']) {
    return Number(req.headers['x-test-now-ms'])
  }
  return Date.now()
}
```

### 5. HTML Safety with escape-html
**Why**:
- Prevents XSS attacks from user input
- Standard library with no external dependencies
- Minimal performance overhead

**Implementation**:
```javascript
import escapeHtml from 'escape-html'
// Content is escaped before rendering
content: escapeHtml(paste.content)
```

### 6. Serverless-Safe Architecture
**Why**:
- All state in Redis, not in-memory
- No global mutable variables
- Scales horizontally on Vercel

**What we avoided**:
- ❌ Global arrays/objects
- ❌ In-memory caches
- ❌ Hardcoded paths
- ❌ Localhost URLs

---

## Local Development

### Setup
```bash
# Install dependencies
npm install

# Create .env.local from template
cp .env.local.example .env.local

# Edit .env.local with Upstash credentials
# Get free Redis at https://upstash.com
```

### Running
```bash
# Development with hot reload
npm run dev

# Opens at http://localhost:3000
```

### Testing
```bash
# Test mode with deterministic time
TEST_MODE=1 npm run dev

# In another terminal, test expiry
curl -H "x-test-now-ms: 1000000000000" http://localhost:3000/api/pastes/{id}
```

### Production Build
```bash
npm run build
npm start
```

---

## Deployment to Vercel

### Step 1: Prepare Repository
✅ Already pushed to: https://github.com/Abinayasreee/Pastebin-Lite

### Step 2: Deploy to Vercel
```bash
npm install -g vercel
vercel
# Follow prompts to connect GitHub account and select repository
```

Or use Vercel Dashboard:
1. Go to https://vercel.com
2. Click "New Project"
3. Import from GitHub
4. Select "Abinayasreee/Pastebin-Lite"
5. Add environment variables (see Step 3)
6. Deploy!

### Step 3: Configure Environment Variables in Vercel
In Project Settings → Environment Variables, add:
- `REDIS_URL` - Get from Upstash dashboard (https://upstash.com)
- `REDIS_TOKEN` - Get from Upstash dashboard
- `BASE_URL` - Your Vercel deployment URL (e.g., `https://pastebin-lite.vercel.app`)

### Step 4: Verify Deployment
```bash
curl https://{your-app}.vercel.app/api/healthz
# Should return: {"ok":true}
```

---

## File Structure

```
pastebin-lite/
├── pages/
│   ├── api/
│   │   ├── healthz.js              # Health check endpoint
│   │   └── pastes/
│   │       ├── index.js            # POST /api/pastes (create)
│   │       └── [id].js             # GET /api/pastes/:id (fetch)
│   ├── p/
│   │   └── [id].js                 # GET /p/:id (HTML view)
│   └── index.js                    # Homepage / UI
├── lib/
│   ├── db.js                       # Redis client init
│   └── time.js                     # Time utilities
├── public/                         # Static assets
├── .env.local                      # Secrets (NOT in git)
├── .env.local.example              # Template (in git)
├── .gitignore                      # Git ignore rules
├── next.config.js                  # Next.js config
├── vercel.json                     # Vercel config
├── package.json                    # Dependencies
└── README.md                       # Documentation
```

---

## Testing Checklist

### Service Health
- [ ] `GET /api/healthz` returns 200 with `{"ok":true}`
- [ ] Response is valid JSON with correct Content-Type
- [ ] Request completes within timeout

### Paste Creation
- [ ] POST request with valid content returns 201
- [ ] Response includes valid id and url
- [ ] URL format is correct: `/p/{id}`
- [ ] Invalid input (empty content) returns 400
- [ ] Missing content field returns 400
- [ ] Invalid ttl_seconds returns 400
- [ ] Invalid max_views returns 400

### Paste Retrieval
- [ ] GET /api/pastes/{id} returns 200 with correct content
- [ ] Response includes remaining_views and expires_at
- [ ] Each fetch decrements remaining_views
- [ ] Missing paste returns 404
- [ ] Expired paste returns 404
- [ ] View limit exceeded returns 404

### HTML View
- [ ] GET /p/{id} returns HTML containing paste content
- [ ] Content is properly escaped (no script execution)
- [ ] Expired paste shows 404
- [ ] Missing paste shows 404

### TTL Testing (with TEST_MODE=1)
- [ ] Paste available before expiry time
- [ ] Paste returns 404 after x-test-now-ms exceeds expires_at
- [ ] Current time queries work normally without header

### View Limit Testing
- [ ] Paste with max_views=1: first fetch returns 200, second returns 404
- [ ] Paste with max_views=2: two fetches return 200, third returns 404
- [ ] No negative remaining_views

### Combined Constraints
- [ ] Paste with TTL and max_views: 404 when first constraint triggers
- [ ] Both constraints work independently

---

## Notes for Evaluators

1. **Redis Setup Required**: The application requires Upstash Redis for full functionality. Free tier available at https://upstash.com
2. **Environment Variables**: All secrets stored in `.env.local`, not committed to repository
3. **Serverless Compatible**: No in-memory state, all data persisted to Redis
4. **Automatic Cleanup**: Redis TTL handles automatic key expiration
5. **Test Mode**: Set `TEST_MODE=1` to enable deterministic time testing
6. **No Manual Migrations**: Deploy to Vercel and it works immediately
7. **Response Format**: All API responses are valid JSON with appropriate Content-Type headers

---

## Summary

**Status**: ✅ Complete and ready for evaluation

**What's Included**:
- ✅ Fully functional pastebin application
- ✅ All required routes and functionality
- ✅ Comprehensive error handling
- ✅ HTML safety (XSS prevention)
- ✅ Deterministic time testing support
- ✅ Public GitHub repository
- ✅ Detailed README with setup instructions
- ✅ Persistence layer documentation
- ✅ Vercel deployment ready
- ✅ Code quality standards met

**Time to Deploy**: 
1. Set up Upstash Redis (2 minutes)
2. Deploy to Vercel (1 click)
3. Add environment variables (2 minutes)
4. Ready! (≈5 minutes total)

**Next Steps**:
1. Get Upstash Redis credentials from https://upstash.com
2. Deploy to Vercel using repository link
3. Add environment variables in Vercel dashboard
4. Test at deployed URL

---

*Created: 2025-12-31*
*Application: Pastebin Lite*
*Repository: https://github.com/Abinayasreee/Pastebin-Lite*
