# captionato photos

A self-hosted photography gallery. No compression, ever.

## Stack
- **Next.js 14** — frontend + API routes
- **SQLite + Prisma** — photo metadata, showcase definitions
- **Sharp** — EXIF extraction on upload (no image recompression)
- **Docker** — deployable to Coolify / Dokploy

## Setup

### 1. Clone and configure
```bash
cp .env.example .env
# Edit .env — set SITE_PASSWORD and ADMIN_PASSWORD
```

### 2. Deploy on Coolify / Dokploy
- Create a new service pointing to this repo
- Set the environment variables from `.env`
- Mount a persistent volume at `/data`
- Expose port `3000`, map to your domain `photos.captionato.tech`

### 3. Local dev
```bash
npm install
npx prisma migrate dev
npm run dev
```

## URLs
| Path | Description |
|------|-------------|
| `/` | Landing — drifting photo grid |
| `/login` | Site password gate |
| `/showcase/[slug]` | Individual showcase |
| `/admin` | Upload panel + showcase creator |
| `/admin/login` | Admin password gate |
| `/api/photos/[filename]` | Raw photo serving (no recompression) |

## Adding photos
1. Go to `/admin`
2. Click the upload zone — select any number of photos
3. EXIF is extracted automatically server-side
4. Photos appear in the landing grid immediately

## Creating a showcase
1. Upload photos first
2. In the admin panel, fill in title + caption
3. Click photos to select them (order = selection order)
4. Hit "create showcase" — appears in the navbar instantly
