# Pastebin Lite

A lightweight pastebin service built with Next.js and Redis.

## Features

- Create and share text pastes
- Automatic expiration of pastes
- Simple web UI
- RESTful API

## Project Structure

```
pastebin-lite/
├── pages/
│   ├── api/
│   │   ├── healthz.js           # Health check endpoint
│   │   └── pastes/
│   │       ├── index.js         # POST /api/pastes
│   │       └── [id].js          # GET /api/pastes/:id
│   ├── p/
│   │   └── [id].js              # HTML paste view
│   └── index.js                 # Simple UI
├── lib/
│   ├── db.js                    # Redis client
│   └── time.js                  # Deterministic time helper
├── .env.local                   # Environment variables (not committed)
├── package.json
└── README.md
```

## Installation

1. Clone or create the project
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Redis (locally or using a service)

4. Create `.env.local` with your Redis URL:
   ```
   REDIS_URL=redis://localhost:6379
   ```

## Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### Health Check
- `GET /api/healthz` - Check if the service is healthy

### Create Paste
- `POST /api/pastes`
- Body: `{ "content": "your text", "expiresIn": 60 }`
- Response: `{ "id": "uuid", "url": "/p/uuid" }`

### Get Paste
- `GET /api/pastes/:id` - Get paste data (JSON)
- `GET /p/:id` - Get paste in HTML format

## Build and Deploy

```bash
npm run build
npm start
```

## License

MIT
